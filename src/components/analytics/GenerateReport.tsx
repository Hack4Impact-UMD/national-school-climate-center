import { Button } from '@/components/ui/button'
import { useState } from "react"
import { RiArrowDropDownLine } from "react-icons/ri";


export default function GenerateReport() {
  const [drop, setDrop] = useState(false)

  const handleExportPDF = async () => {
    setDrop(false)
    window.print()
  }

  const handleExportCSV = () => {
    setDrop(false)
  }


  return (
    <div className="relative inline-block">
      <Button variant="secondary" onClick={() => setDrop(!drop)}>Generate Report <RiArrowDropDownLine /></Button>

      {drop && (
        <div>
          <div onClick={() => setDrop(false)} />

          <div className=" mt-1 absolute w-full rounded-lg overflow-hidden">

            {/*I'll come back and make a functionality where onclick is forwards to aspecific funationality */}
            <Button onClick={handleExportPDF} className="w-full text-white rounded-none">
              PDF
            </Button>

            <Button onClick={handleExportCSV} className="w-full text-white rounded-none">
              CSV
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
