import { useClientContext } from "../client-screen"
import { Card } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

export const ClientDetails = () => {
  const { 
    clientId,
    loanAmount, 
    depositAmount, 
    employmentStatus, 
    currentRole, 
    company, 
    propertyType,
    updateClient
  } = useClientContext();

  const handleFieldUpdate = (field: string, value: string | number) => {
    updateClient(clientId, { [field]: value });
  };

  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4">Client Information</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-3 sm:gap-y-4 items-end">
        {/* Row 1 */}
        <div className="flex flex-col">
          <Label htmlFor="loanAmount" className="mb-2">Requested Loan Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-mono">£</span>
            <Input
              id="loanAmount"
              type="number"
              value={loanAmount}
              onChange={(e) => handleFieldUpdate('loanAmount', Number(e.target.value))}
              className="font-mono w-full pl-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <Label htmlFor="currentRole" className="mb-2">Current Role</Label>
          <Input
            id="currentRole"
            value={currentRole === 'Type information here' ? '' : currentRole}
            onChange={(e) => handleFieldUpdate('currentRole', e.target.value)}
            placeholder="Type information here"
            className="w-full"
          />
        </div>

        {/* Row 2 */}
        <div className="flex flex-col">
          <Label htmlFor="depositAmount" className="mb-2">Deposit Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-mono">£</span>
            <Input
              id="depositAmount"
              type="number"
              value={depositAmount}
              onChange={(e) => handleFieldUpdate('depositAmount', Number(e.target.value))}
              className="font-mono w-full pl-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <Label htmlFor="company" className="mb-2">Company</Label>
          <Input
            id="company"
            value={company === 'Type information here' ? '' : company}
            onChange={(e) => handleFieldUpdate('company', e.target.value)}
            placeholder="Type information here"
            className="w-full"
          />
        </div>

        {/* Row 3 */}
        <div className="flex flex-col">
          <Label htmlFor="employmentStatus" className="mb-2">Employment Status</Label>
          <Select value={employmentStatus === 'Select employment status' ? '' : employmentStatus} onValueChange={(value) => handleFieldUpdate('employmentStatus', value)}>
            <SelectTrigger className={`w-full ${employmentStatus === 'Select employment status' ? 'text-muted-foreground' : ''}`}>
              <SelectValue placeholder="Select employment status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Employed (PAYE)">Employed (PAYE)</SelectItem>
              <SelectItem value="Self-employed">Self-employed</SelectItem>
              <SelectItem value="Retired">Retired</SelectItem>
              <SelectItem value="Student">Student</SelectItem>
              <SelectItem value="Unemployed">Unemployed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col">
          <Label htmlFor="propertyType" className="mb-2">Property Type</Label>
          <Select value={propertyType === 'Select property type' ? '' : propertyType} onValueChange={(value) => handleFieldUpdate('propertyType', value)}>
            <SelectTrigger className={`w-full ${propertyType === 'Select property type' ? 'text-muted-foreground' : ''}`}>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="First-time buyer">First-time buyer</SelectItem>
              <SelectItem value="Home mover">Home mover</SelectItem>
              <SelectItem value="Remortgage">Remortgage</SelectItem>
              <SelectItem value="Buy-to-let">Buy-to-let</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  )
}