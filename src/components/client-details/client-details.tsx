import { useClientContext } from "../client-screen"
import { Card } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

export const ClientDetails = () => {
  const { name, loanAmount } = useClientContext();
  return (

    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Client Information</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="clientName">Client Name</Label>
          <Input
            id="clientName"
            value={name}
            disabled
            className="bg-muted"
          />
        </div>
        <div>
          <Label htmlFor="loanAmount">Requested Loan Amount</Label>
          <Input
            id="loanAmount"
            type="number"
            value={loanAmount}
            // onChange={(e) => onUpdateLoanAmount(Number(e.target.value))}
            className="font-mono"
          />
        </div>
      </div>
    </Card>




  )
}