import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ManageUsers() {
  const [open, setOpen] = useState(false);
  const [emails, setEmails] = useState([
    { email: "johnsmith@gmail.com", role: "Admin" },
    { email: "johnsmith@gmail.com", role: "Employee" },
    { email: "johnsmith@gmail.com", role: "School" },
  ]);

  return (
    <div className="p-6">
      <h1 className="font-heading text-4xl font-bold text-heading mb-4">
        Manage Access
      </h1>
      <div className="flex justify-between items-center mb-6">
        <p className="font-body text-lg text-body">
          Users
        </p>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input 
              type="text"
              placeholder="Search by name"
              className="p1-8 bg-gray-100 w-64 cursor-text"
            />
            <Search className="absolute right-2 top-2.5 w-4 h-4 text-gray-500" />
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="bg-[#4C7FCC] hover:bg-[#3c68b3] text-white flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Invite users
          </Button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Name</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Email</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Last Active</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Role</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(8)].map((_, i) => (
              <tr key={i} className="border-t border-gray-100 h-12">
                <td className="px-6"></td>
                <td className="px-6"></td>
                <td className="px-6"></td>
                <td className="px-6"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#4C7FCC] text-2xl font-semibold">
              Invite Users
            </DialogTitle>
            <DialogDescription>
              Invite users and manage access in workspace.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 border-t border-gray-200 pt-4">
            <p className="font-medium mb-2">Invite new users</p>
            <p className="text-sm text-gray-600 mb-3">Add new users by email.</p>

            <div className="flex gap-2 mb-4">
              <div className="relative flex-grow">
                <Input
                  type="email"
                  placeholder="Email"
                  className="pr-8 bg-gray-100 cursor-text"
                />
                <Search className="absolute right-2 top-2.5 w-4 h-4 text-gray-500" />
              </div>
              <Button className="bg-[#4C7FCC] hover:bg-[#3c68b3] text-white cursor-pointer">
                Send Invite
              </Button>
            </div>

            <div className="space-y-2">
              {emails.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border border-gray-200 rounded-lg p-2"
                >
                  <p className="text-sm text-gray-700">{item.email}</p>
                  <Select defaultValue={item.role}>
                    <SelectTrigger className="w-32 bg-gray-50 cursor-pointer">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="Admin" className="cursor-pointer">Admin</SelectItem>
                      <SelectItem value="Employee" className="cursor-pointer">Employee</SelectItem>
                      <SelectItem value="School" className="cursor-pointer">School</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setOpen(false)}
              className="bg-[#4C7FCC] hover:bg-[#3c68b3] text-white mt-4 w-full cursor-pointer"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
