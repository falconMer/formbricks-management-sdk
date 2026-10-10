# Jostraca and the Problem of Regenerating Edited Code

*By Smail Mersad | 10 October 2026*

Imagine generating a TypeScript SDK for an API. The generator creates the files you need, and everything looks fine. A few days later, you edit one of those files to fix a problem with authentication. Then the API changes, so you run the generator again. Will your fix still be there?

That situation explains why I wanted to look at [Jostraca](https://github.com/jostraca/jostraca). It's an open-source library for generating files and projects, and it's used by the Voxgig SDK generator. It can create a project from scratch, but it also has options for dealing with files that developers have already edited.

I read Jostraca's tutorial, README, and technical documentation. I haven't run its test suite myself, so the behavior discussed here comes from the published examples and reference docs.

## Generating files without writing them one by one

With a basic script, generating a project might mean creating directories, building strings, and writing each file to disk. Jostraca lets you describe the file structure using JavaScript functions instead.

Here's a small example based on its documented API:

```js
import { Jostraca, Project, Folder, File, Content } from 'jostraca'

const generator = Jostraca()

await generator.generate({ folder: './out' }, () => {
  Project({ folder: 'sample-sdk' }, () => {
    Folder({ name: 'src' }, () => {
      File({ name: 'index.ts' }, () => {
        Content('export const version = "1.0.0"\n')
      })
    })
  })
})
```

This describes a file at `out/sample-sdk/src/index.ts`. Jostraca first builds a description of the files and folders, then processes it to create the output. Separating those steps gives the library a chance to decide what to do if a file already exists.

I like that the generator logic is ordinary JavaScript. You can use loops to generate several files, conditions to include optional features, and functions to reuse code. There's no separate template language to learn for those decisions.

There is a downside, though. A large generated source file can become difficult to read if its contents are split across many `Content()` calls. When I want to understand what code will be produced, opening a normal template file is easier than following deeply nested JavaScript. Jostraca supports templates and slots too, so I would use its components for file structure and keep longer source files in templates.

## What happens when someone edits a generated file?

Jostraca gives you several choices when a file already exists. You can replace it, save a backup, put the new version beside it, compare versions, or try to merge the changes.

The merge feature interests me because generated SDKs may need changes between releases. To understand it, think of three versions of a file: the version the generator created last time, the version a developer has edited, and the new version the generator wants to create. Jostraca uses the old generated version to work out which changes came from each side.

The following example is adapted from the project's regeneration tutorial:

```js
import { appendFileSync } from 'node:fs'
import { Jostraca, Project, File, Content } from 'jostraca'

const generator = Jostraca({
  existing: { txt: { merge: true } },
})

const generateConfig = (port) => generator.generate(
  { folder: './out' },
  () => {
    Project({}, () => {
      File({ name: 'config.sh' }, () => {
        Content(`PORT=${port}\nHOST=localhost\n`)
      })
    })
  }
)

await generateConfig(8080)
appendFileSync('./out/config.sh', 'DEBUG=1\n')
await generateConfig(9090)
```

The first run writes a configuration file. The developer then adds `DEBUG=1` manually. On the next run, the generator changes the port from `8080` to `9090`. According to the documented merge behavior, both changes can survive: the new port and the extra debug setting.

If the developer and the generator change the same lines, Jostraca can put conflict markers in the file. Someone then has to decide which version to keep. I prefer that to silently losing an edit.

## The missing-history problem

My main concern is what happens if Jostraca cannot find the previous generated version. Its [options reference](https://github.com/jostraca/jostraca/blob/main/docs/reference-options.md) says that a requested merge can fall back to **overwriting the existing file without a warning** when the saved version is missing.

The saved copies normally go under `.jostraca/generated/`. By default, the project also creates Git ignore rules for its generated history. That means a teammate who clones a repository may have the generated files but not the older copies needed for merging.

For example, suppose I customize a generated API client and commit that change. Another developer clones the repository, updates the API specification, and regenerates the client. If the merge history wasn't committed, Jostraca may overwrite the customized code instead of merging it. That would be especially frustrating because the developer explicitly selected `merge: true`.

I think the safer behavior would be to stop with an error when the old generated file is missing. The message could explain the problem and offer an option to overwrite if that's what the developer wants. It should be a choice, not an automatic fallback.

The library has a `control.version` setting that helps teams manage whether the history is ignored by Git. But the team still needs to decide what to commit and make sure every developer or build environment has the same files. I'd prefer clearer guidance on this in the quickstart for people who plan to regenerate code in a shared repository.

## A confusing option for keeping the original file

There's another small setting that could cause trouble. Jostraca has a `present` option, which writes a proposed new file beside the existing one. I would expect `present: true` to leave the original file alone, but the docs explain that `write` is checked first and defaults to `true`.

You actually need both settings:

```js
const generator = Jostraca({
  existing: { txt: { write: false, present: true } },
})
```

This keeps the original and writes a `.new` file for comparison. The documentation is clear once you find the explanation, but a beginner could easily set only `present: true` and overwrite a file. I would prefer a single option that selects one behavior, rather than several settings that can contradict each other.

Jostraca also supports a `JOSTRACA_PROTECT` marker inside an existing file to prevent overwriting it. That is practical when a developer wants to take ownership of a generated file, although I wouldn't want a project to depend on developers remembering to add special markers manually.

## Would I use it?

For a one-time project starter, I'd probably choose a template repository or a small script. Jostraca asks you to learn an API and decide how regenerated files should be handled. That setup makes more sense when you know you'll generate the project repeatedly.

For an SDK generator, I can see the benefit. Jostraca has documentation with examples that are checked by tests, plus TypeScript and Go implementations with shared test cases. I also appreciate that the docs explain the merge limitations instead of presenting regeneration as completely safe.

Before using it with a team, I would create a small test project, generate a file, edit it manually, and generate it again. I'd repeat the test after deleting the saved history. I would also make the project's automated checks report merge conflicts as failures, so they get reviewed before publishing an SDK update.

If those checks were in place, I would be comfortable considering Jostraca for a project that needs regular regeneration. The missing-history case is still something I would want the library to handle more safely, because a developer can follow the documented merge option and still lose changes.

**References:** [Repository](https://github.com/jostraca/jostraca), [tutorial](https://github.com/jostraca/jostraca/blob/main/docs/tutorial.md), [options reference](https://github.com/jostraca/jostraca/blob/main/docs/reference-options.md), [design explanation](https://github.com/jostraca/jostraca/blob/main/docs/explanation.md).