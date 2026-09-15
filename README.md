# RoM-Nav project page

Static project page for *Learning Safe Humanoid Navigation from Reduced Order Models*.
Served by GitHub Pages from the repository root.

Plain HTML, one stylesheet, one script. No build step, no framework. KaTeX is loaded
from a CDN with subresource integrity; everything else is local.

    index.html      the page
    css/main.css    design system
    js/site.js      selectors, scroll spy, bibtex copy, youtube facade
    media/          web encodes of the paper's 4K masters (~140 MB)
    paper/          the manuscript PDF

## Regenerating the media

Nothing in `media/` is edited by hand. It is produced from the 4K masters in the
(private) research repo:

    bash scripts/website/build_media.sh /path/to/rom-nav

Re-running reproduces the whole tree. Never commit a 4K source here — GitHub rejects a
push containing a file over 100 MB, and the largest file in this repo is 55 MB.

## Before publishing

Four placeholders, all marked `TODO` in the source:

1. **Authors** — `index.html`, `#author-list` and the `.affil` line below it.
2. **arXiv** — `index.html`, `#arxiv-link`: set `href` and remove `aria-disabled`.
3. **YouTube** — `index.html`, `#yt-facade`: set `data-yt` to the video id.
   Until then the facade renders but does not load an iframe.
4. **BibTeX** — `index.html`, `#bibtex`: author field and the final venue.

## Checked

Chrome at 390 px and 1280 px, light and dark, no horizontal page overflow at either
width. Videos are `preload="none"` behind posters, and the selectors swap `src` rather
than hiding elements, so only the clip being watched is ever downloaded.
