# Cloudinary media setup

1. Create a Cloudinary account and open **Media Library**. Copy the cloud name from the Cloudinary dashboard.
2. In `portfolio`, copy `.env.example` to `.env.local` and set:

   ```env
   NEXT_PUBLIC_CLOUDINARY_BASE_URL=https://res.cloudinary.com/YOUR_CLOUD_NAME
   ```

   Use only the base shown. Do not append `/image/upload` or a folder name. Restart the Next.js server after changing it. Add the same variable to your deployment provider's environment settings.

3. Upload assets into these Cloudinary folders. The folders are case-sensitive and should match the public IDs below.

   ```text
   creative-works/
     3d/
       archviz/
       models/
       product-renders/
       animations/
     graphic-design/
     video-editing/
   projects/
   certificate/
   ```

4. Keep each creative work's media list in its markdown file under `content/creative-works`. Use paths relative to `creative-works`, including subfolders and the file extension. Example:

   ```yaml
   media: [3d/models/Donut-01.png, 3d/models/Donut-animation-01.mp4]
   ```

   Upload those files to `creative-works/3d/models/` in Cloudinary. Cloudinary public IDs and filename capitalization must match the markdown. For videos, upload as video assets while preserving the filename. Add new work markdown under the matching category directory; homepage sections show three entries and the category page lists all entries.

5. Project screenshots use the project markdown slug as the filename. For the current three projects that means `snitch.png`, `tudu.png`, and `reeli.png`. Upload them directly to `projects/` in Cloudinary.

6. Certificate previews are uploaded to `certificate/` and default to `<certificate-slug>.png`. To choose a different filename, add `picture: your-file-name.png` to that certificate's frontmatter.

7. Screenshot recommendations per project:

   | Project  | What to capture                                                | Route to open        |
   | -------- | -------------------------------------------------------------- | -------------------- |
   | Snitch   | Signed-in feed showing posts, sidebar and composer             | `snitch-social-frontend.vercel.app` |
   | Tudu     | The Kanban board with a few populated columns                   | `tudu-kanban.vercel.app` |
   | Reeli    | The browse shelf or a title page with trailer and watch options | `reeli-movies.vercel.app` |

   Capture at 1440px wide so the cards are not letterboxed. Keep the file a `.png` under roughly 500KB.

Cloudinary asset delivery URL format:

```text
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/creative-works/3d/models/Donut-01.png
https://res.cloudinary.com/YOUR_CLOUD_NAME/video/upload/creative-works/3d/models/Donut-animation-01.mp4
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/projects/snitch.png
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/projects/tudu.png
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/projects/reeli.png
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/certificate/product-design.png
```

The app uses unsigned delivery URLs only; never put an API secret in a `NEXT_PUBLIC_` variable. Ensure uploaded media is publicly deliverable or configure Cloudinary signed delivery separately before using restricted assets.
