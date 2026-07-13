import { BundleBuilder } from "../src/components/BundleBuilder";
import { ReviewPanel } from "../src/components/ReviewPanel";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-350 flex-col gap-6 px-4 py-6 lg:flex-row lg:items-start lg:gap-8 lg:px-8 lg:py-10">
      <div className="min-w-0 flex-1">
        <BundleBuilder />
      </div>
      <div className="w-full lg:sticky lg:top-10 lg:w-95 lg:shrink-0">
        <ReviewPanel />
      </div>
    </main>
  );
}
