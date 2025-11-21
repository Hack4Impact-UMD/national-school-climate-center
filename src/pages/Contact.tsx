export default function Contact() {
  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto bg-[#ffffff] min-h-screen">
      <h1 className="font-heading text-4xl font-bold text-[#1C1C1C] mb-10">
        Contact Us
      </h1>

      <div className="mb-14">
        <h2 className="text-xl font-semibold font-heading text-[#2F6CC0] mb-4">
          Contact Information
        </h2>

        <div className="space-y-4 font-body text-[#6C7A89]">
          <div className="flex items-center gap-3">
            <span className="text-[#2F6CC0] text-xl">📧</span>
            <p className="text-lg">nscc@gmail.com</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#2F6CC0] text-xl">📞</span>
            <p className="text-lg">123-456-789</p>
          </div>
        </div>
      </div>
      <h2 className="text-xl font-semibold font-heading text-[#2F6CC0] mb-2">
        Need Help?
      </h2>
      <p className="font-body text-[#6C7A89] mb-10">
        Look at our resources for support.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-[#2F6CC0] rounded-xl p-6 hover:bg-[#269ACF22] transition cursor-pointer">
          <div className="text-[#2F6CC0] text-2xl mb-3">arrow icon</div>
          <h3 className="font-heading font-semibold text-lg text-[#2F6CC0]">
            Getting Started
          </h3>
          <p className="font-body text-[#6C7A89] text-sm mt-1">
            How to get started.
          </p>
        </div>
        <div className="border border-[#2F6CC0] rounded-xl p-6 hover:bg-[#269ACF22] transition cursor-pointer">
          <div className="text-[#2F6CC0] text-2xl mb-3">👤</div>
          <h3 className="font-heading font-semibold text-lg text-[#2F6CC0]">
            Account Settings
          </h3>
          <p className="font-body text-[#6C7A89] text-sm mt-1">
            Manage your accounting information.
          </p>
        </div>
        <div className="border border-[#2F6CC0] rounded-xl p-6 hover:bg-[#269ACF22] transition cursor-pointer">
          <div className="text-[#2F6CC0] text-2xl mb-3">🔒</div>
          <h3 className="font-heading font-semibold text-lg text-[#2F6CC0]">
            Privacy and Security
          </h3>
          <p className="font-body text-[#6C7A89] text-sm mt-1">
            Protect your privacy and secure information.
          </p>
        </div>
      </div>
    </div>
  );
}
