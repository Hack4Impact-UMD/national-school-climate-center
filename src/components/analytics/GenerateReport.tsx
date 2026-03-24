import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { RiArrowDropDownLine } from 'react-icons/ri'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default function GenerateReport({ setExport, chartsData }: any) {
  const [drop, setDrop] = useState(false)
  const [generating, setGenerating] = useState(false)

  const handleExportPDF = async () => {
    setDrop(false)
    setExport(true)
    setGenerating(true)
    await new Promise((r) => setTimeout(r, 6000))
    const data = document.getElementById('analyticsInsight')

    if (!data) {
      console.error("Can't find the report element")
      return
    }

    try {
      const canvas = await html2canvas(data, { scale: 2 })
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = 210
      const pageHeight = 297

      const charts = data.querySelector('.grid')?.children ?? []
      const chartCards = Array.from(charts)
      const top = data.getBoundingClientRect().top
      const rowBottoms = []

      for (let i = 0; i < chartCards.length; i += 2) {
        const rowCards = chartCards.slice(i, i + 2)
        const rowBottom = Math.max(
          ...rowCards.map((e) => (e.getBoundingClientRect().bottom - top) * 2)
        )
        rowBottoms.push(rowBottom)
      }

      let currentY = 0
      const pixelPerMM = canvas.width / pageWidth
      while (currentY < canvas.height) {
        const availablePixels = pageHeight * pixelPerMM
        const targetY = currentY + availablePixels
        const filteredRows = rowBottoms.filter(
          (y) => y > currentY && y <= targetY
        )
        const nextY =
          targetY >= canvas.height
            ? canvas.height
            : filteredRows.length > 0
              ? filteredRows[filteredRows.length - 1]
              : targetY
        const sliceHeight = nextY - currentY
        const pageCanvas = document.createElement('canvas')
        pageCanvas.width = canvas.width
        pageCanvas.height = sliceHeight
        const context = pageCanvas.getContext('2d')
        if (context == null) {
          return
        }
        context.drawImage(
          canvas,
          0,
          currentY,
          canvas.width,
          sliceHeight,
          0,
          0,
          canvas.width,
          sliceHeight
        )
        const imageData = pageCanvas.toDataURL('image/png')
        pdf.addImage(
          imageData,
          'PNG',
          0,
          0,
          pageWidth,
          sliceHeight / pixelPerMM
        )
        currentY = nextY
        if (currentY < canvas.height) {
          pdf.addPage()
        }
      }

      const time = new Date()
      const timeText = time.toLocaleString()

      pdf.setFontSize(10)
      pdf.text(
        `Generated report as of: ${timeText}`,
        pageWidth / 2,
        pageHeight,
        { align: 'center' }
      )

      console.log('Downloading as PDF')
      pdf.save('Analytics_Report.pdf')
    } catch (error) {
      console.error('Failed to generate the PDF', error)
    } finally {
      setExport(false)
      setGenerating(false)
    }
  }

  const handleExportCSV = () => {
    setDrop(false)
    setGenerating(true)
    let csv = 'Survey Title, Question, Answer\n'

    try {
      chartsData.map((chart: any) => {
        chart.chartData.map((item: any) => {
          csv += `"${chart.surveyTitle}", "${chart.question}", "${item.name}"\n`
        })
      })
      const encodedCSV = encodeURI(csv)
      const downloadLink = document.createElement('a')
      downloadLink.href = `data:text/csv;charset=utf-8, ${encodedCSV}`
      downloadLink.setAttribute('download', 'Analytics_Report.csv')
      downloadLink.click()
      console.log('Downloading as CVS')
    } catch (error) {
      console.error('Failed to generate the PDF', error)
    } finally {
      setExport(false)
      setGenerating(false)
    }
  }

  return (
    <div className="relative inline-block">
      <Button variant="secondary" onClick={() => setDrop(!drop)}>
        Generate Report <RiArrowDropDownLine />
      </Button>
      {generating && <span className="ml-2 text-body">Generating...</span>}

      {drop && (
        <div>
          <div onClick={() => setDrop(false)} />

          <div className=" mt-1 absolute w-full rounded-lg overflow-hidden">
            <Button
              onClick={handleExportPDF}
              className="w-full text-white rounded-none"
            >
              PDF
            </Button>

            <Button
              onClick={handleExportCSV}
              className="w-full text-white rounded-none"
            >
              CSV
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
