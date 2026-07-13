import { getCatalog } from "../data/getCatalog";
import { BundleStep } from "./BundleStep";

export async function BundleBuilder() {
  const catalog = await getCatalog();
  const orderedSteps = [...catalog.steps].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col gap-4">
      {orderedSteps.map((step, index) => (
        <BundleStep key={step.id} step={step} nextStep={orderedSteps[index + 1]} />
      ))}
    </div>
  );
}
