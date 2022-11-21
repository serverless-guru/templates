+++
title  = "Add Services"
weight = 3

# geekdocFlatSection: false
# geekdocToc: 6
# geekdocHidden: false
+++

Documentation for a service could be added directly inside this repository:

```bash
hugo new --kind docs services/my-service/page-name.md
```

But it is easier to manage the documentation in the relevant repository and import it here

## Concept
Each service repository contains documentation pages that are included in this site using [modules](https://gohugo.io/hugo-modules/).

```plain
content/
├── services
│   ├── _index.md
│   ├── service1 (mounted from https://github.com/OrgName/repoA/documentation)
│   └── service2 (mounted from https://github.com/OrgName/repoB/documentation)
│
└── documentation
    ├── _index.md
    ├── pages.md
    └── theme.md
```

## Service repository
### Define it as module
Create go.mod in the root
```plain
module github.com/OrgName/repoA

go 1.16
```
### Add a documentation folder
```bash
cd my-service
mkdir documentation
```

### Add pages
```bash
cd my-service
touch documentation/_index.md
mkdir -p documentation/api/
touch documentation/api/_index.md
touch documentation/api/post.md
```

In each page add the relevant FrontMatter. Minimum needed:
```toml
+++
title  = "My Page Title"
weight = 1
+++
```

## This Repo

### Mount the service repo's documentation

Add the module definition to _config.toml_:
```toml
[module]
[[module.imports]]
path="github.com/OrgName/repoA"
disabled=false
[[module.imports.mounts]]
source="documentation"
target="content/services/service1"
```

### Update modules
```bash
hugo mod get -u
```

### Visualize changes locally
Get a copy of the Documentation repo:

```bash
git clone https://github.com/OrgName/documentation
cd documentation/site
hugo mod get -u
```

Edit go.mod:

Add `replace github.com/OrgName/service1 => /path/to/service1`  before the `require` definitions

Run hugo locally:
```bash
hugo server -DEF
```

{{< hint type=note >}}
Changes made in your _documentation module_ will be reloaded automatically in your local site.
{{</hint>}}

{{< hint type=warning >}}
Don't commit the changes made to _go.mod_.
{{</hint>}}