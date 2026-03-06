import { Button } from '@/components/ui/button'
import { useState } from "react"
import { RiArrowDropDownLine } from "react-icons/ri";
import html2canvas from "html2canvas"
import jsPDF from "jspdf"



export default function GenerateReport() {
  const [drop, setDrop] = useState(false)

  const handleExportPDF = async () => {
    setDrop(false)
    const data = document.getElementById("analyticsInsight")

    try {
      const canvas = await html2canvas(data,  {scale: 2})
      const imgData = canvas.toDataURL("image/png")

      const pdf = new jsPDF("p", "mm", "a4")
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
      console.log("Downloading as PDF")
      pdf.save("Analytics_Report.pdf")
    } catch(error){
      console.error("Failed to generate the PDF", error)
    }
    
    //window.print()
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
