<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application architecture
- The Spanish kit sales page lives at `/kit-biblico`; `/` redirects there because the requested page has an explicit URL and this project had no original sales page.
- Keep the kit presentation in `src/components/kit-page.tsx` and its semantic design system in `src/styles.css` so all sections share consistent styling.
- Import product media from Lovable Assets pointer JSON files; use only the authentic source-site materials to avoid misrepresenting the PDFs.
- Keep illustrative conversations in a separate presentation component within the benefits section to preserve the seven-section page structure.
