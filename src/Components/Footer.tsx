import { FaLinkedinIn, FaTwitter } from "react-icons/fa6";

function Footer() {
  return (
    <div className="w-full static  bottom-0">
      <div className="flex justify-between   bg-[#262626] text-white py-3 mx-20 px-3 rounded-2xl items-center mb-10">
        <div className="flex gap-3">
          <FaTwitter className="text-black text-2xl bg-white p-1 rounded-lg" />
          <FaLinkedinIn className="text-black text-2xl bg-white p-1 rounded-lg" />
        </div>
        <p>© 2024 FlexFuse. All Rights Reserved.</p>
      </div>
    </div>
  );
}

export default Footer;
