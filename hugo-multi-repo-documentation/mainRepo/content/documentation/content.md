+++
title  = "Content"
weight = 2

# geekdocFlatSection = false
# geekdocToc = 6
# geekdocHidden = false
+++

Content pages are located in the _content_ folder. The structure tree of the _content_ folder is the tree of the menu.

Adding an _\_index.md_ allows to define a page related to the folder.

```plain
content/
├── level-1
│   ├── _index.md
│   ├── level-1-1.md
│   ├── level-1-2.md
│   └── level-1-3
│       ├── _index.md
│       └── level-1-3-1.md
└── level-2
    ├── _index.md
    ├── level-2-1.md
    └── level-2-2.md
```

## Page or folder?
Using a page or a folder will have the same result. Both examples below will give the same result:

{{< columns >}}
__Single Page__
```plain
content/
└── level-1
    └── level-1-1.md
```
<--->
__Folder Page__
```plain
content/
└── level-1
    └── level-1-1
        └── _index.md
```
{{< /columns >}}

One reason to use a _folder page_ is to organize better images related to the content instead of having all related assets in a single folder.

```plain
content/
└── level-1
    └── level-1-1
        ├─── _index.md
        ├─── image1.jpg
        └─── image2.jpg
```


