+++
title  = "Add Pages"
weight = 4

# geekdocFlatSection: false
# geekdocToc: 6
# geekdocHidden: false
+++
## Install Hugo

More details on [gohugo.io](https://gohugo.io/getting-started/installing)

### Homebrew
```Bash
brew install hugo
```
### Pre-Built Binary
Get the lastest binary from gohugo's [release](https://github.com/gohugoio/hugo/releases/latest) page.

Replace the release version with the latest. make sure to get the _extended_ version.

```Bash
wget https://github.com/gohugoio/hugo/releases/download/v0.105.0/hugo_extended_0.105.0_Linux-64bit.tar.gz
tar xzfv hugo_0.105.0_Linux-64bit.tar.gz
sudo chmod 755 hugo
sudo mv hugo /usr/local/bin/
```

## Clone repo
```bash
git clone https://github.com/OrgName/documentation
cd documentation
```

## Add a new page
```bash
hugo new --kind docs documentation/page-name.md
```

* Change the _title_ and _weight_ in the FrontMatter.
* Add page content in Markdown