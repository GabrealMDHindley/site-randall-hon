import { agent } from "@/content/agent";
import { StaggerGroup, StaggerItem } from "@/components/ui/Reveal";

export function CredentialsRow() {
  const items = [
    { label: "License", value: agent.license },
    { label: "Licensed Since", value: String(agent.licensedSince) },
    { label: "Closed Transactions", value: agent.closedTransactions },
    { label: "Brokerage", value: agent.brokerage },
  ];

  return (
    <StaggerGroup className="grid grid-cols-2 gap-6 border-y border-line py-10 lg:grid-cols-4">
      {items.map((item) => (
        <StaggerItem key={item.label}>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
            {item.label}
          </p>
          <p className="mt-2 font-display text-lg text-paper">{item.value}</p>
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}
