import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Copy, Check } from 'lucide-react'

interface PublishSuccessDialogProps {
  url: string
  open: boolean
  onClose: () => void
  onNavigate: () => void
}

export function PublishSuccessDialog({
  url,
  open,
  onClose,
  onNavigate,
}: PublishSuccessDialogProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).catch(() => {})
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle>Survey published!</DialogTitle>
              <DialogDescription className="mt-0.5">
                Share this link with respondents.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 min-w-0">
          <span className="min-w-0 flex-1 truncate font-mono text-sm text-muted-foreground">
            {url}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="shrink-0 gap-1.5"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" /> Copy
              </>
            )}
          </Button>
        </div>

        <DialogFooter>
          <Button onClick={onNavigate}>Go to surveys</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
