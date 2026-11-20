# Media hosting (Cloudinary, free plan)

The site never serves media from your computer in production. Everything is delivered from Cloudinary, so a file only shows up when:

1. it is uploaded under the right public ID, and
2. `NEXT_PUBLIC_CLOUDINARY_BASE_URL` is set where the site is built (`.env.local` locally, Vercel for production).

## Public IDs (generated automatically by `npm run media:upload`)

| Local file | Cloudinary public ID |
| --- | --- |
| `../creative work/3d/models/Donut-01.png` | `creative-works/3d/models/Donut-01` |
| `../creative work/3d/models/Donut-animation-01.mp4` | `creative-works/3d/models/Donut-animation-01` |
| `projects/tudu.png` | `projects/tudu` |
| `certificates/my-cert.png` | `certificate/my-cert` |

File names must not contain spaces or dots (except the extension). Use `Chanel-No-5.png`, not `Chanel No.5.png`.

## Commands

```powershell
npm run media:sync     # link files in "creative work" to markdown entries (add --write via: node scripts/sync-creative.mjs --write)
npm run media:upload   # upload anything new to Cloudinary
npm run media:check    # verify every file referenced by your content is reachable
```

## Free plan limits

Images up to 10 MB and videos up to 100 MB per file. Compress anything larger (for example with `ffmpeg -i in.mp4 -vcodec libx264 -crf 28 -vf scale=1280:-2 out.mp4`).

## Project screenshots

`content/projects/<slug>.md` lists them in `screens: [tudu.png, tudu-2.png]`. Name the files exactly like that and upload them.
