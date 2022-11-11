+++
title  = "Deploy"
weight = 5

# geekdocFlatSection: false
# geekdocToc: 6
# geekdocHidden: false
+++
## From local
```bash
cd site
# Update all modules
hugo mod get -u
hugo
aws s3 sync --cache-control max-age=86400 public/ s3://doc.example.com/
```
