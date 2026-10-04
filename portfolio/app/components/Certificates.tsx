import { certificates, getCertificatePreview } from "@/lib/content";
import CertificateExplorer from "./CertificateExplorer";

export default function Certificates() {
  return (
    <section id="certificates" className="py-20">
      <div className="section-shell">
        <div className="mb-10">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-violet-300">
            Certificates
          </p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">Recognition & learning</h2>
        </div>

        <CertificateExplorer certificates={certificates.map((item) => ({
          ...item,
          preview: getCertificatePreview(item.slug, typeof item.picture === "string" ? item.picture : `${item.slug}.png`).path,
        }))} />
      </div>
    </section>
  );
}
