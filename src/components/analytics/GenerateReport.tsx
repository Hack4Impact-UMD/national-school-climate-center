import { Button } from '@/components/ui/button'
import { useState } from "react"
import { RiArrowDropDownLine } from "react-icons/ri";
import html2canvas from "html2canvas"
import jsPDF from "jspdf"


export default function GenerateReport({setExport, chartsData}: any) {
  const [drop, setDrop] = useState(false)

  const handleExportPDF = async () => {
    setDrop(false)
    setExport(true)
    await new Promise(r => setTimeout(r, 6000))
    const data = document.getElementById("analyticsInsight")

    if (!data){
      console.error("Can't find the report element")
      return
    }



    try {
      const canvas = await html2canvas(data,  {scale: 2})
      const imgData = canvas.toDataURL("image/png")

      const pdf = new jsPDF("p", "mm", "a4")
      const pageWidth = 210
      const pageHeight = 297
    
      const imgHeight = canvas.height * pageWidth /canvas.width

      pdf.setFontSize(20)
      pdf.text("Analytics Report", (pageWidth/2), 15, {align : "center"})

      const time = new Date()
      const timeText = time.toLocaleString()

  
      for (let y = 0; y < imgHeight; y += pageHeight) {
        if (y > 0){
          pdf.addPage()
        }
        pdf.addImage(imgData, "PNG", 0,25 -y, pageWidth, imgHeight)
      }
      pdf.setFontSize(10)
      pdf.text(`Generated report as of: ${timeText}`, (pageWidth/2), (pageHeight-15), {align: "center"})

      console.log("Downloading as PDF")
      pdf.save("Analytics_Report.pdf")
    } catch(error){
      console.error("Failed to generate the PDF", error)
    } finally {
    setExport(false)
  }}



  const handleExportCSV = () => {
    setDrop(false)     
    let csv = "Survey Title, Question, Answer\n"
    
    try{
      chartsData.map((chart: any) => {
        chart.chartData.map((item: any) => {
        csv += `"${chart.surveyTitle}", "${chart.question}", "${item.name}"\n`
      
      })
    })
      const encodedCSV = encodeURI(csv)
      const downloadLink = document.createElement("a")
      downloadLink.href = `data:text/csv;charset=utf-8, ${encodedCSV}`
      downloadLink.setAttribute("download", "Analytics_Report.csv")
      downloadLink.click()
      console.log("Downloading as CVS")

    }catch (error){
      console.error("Failed to generate the PDF", error)
    }finally{
      setExport(false)
    }
  }




  return (
    <div className="relative inline-block">
      <Button variant="secondary" onClick={() => setDrop(!drop)}>Generate Report <RiArrowDropDownLine /></Button>

      {drop && (
        <div>
          <div onClick={() => setDrop(false)} />

          <div className=" mt-1 absolute w-full rounded-lg overflow-hidden">

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
