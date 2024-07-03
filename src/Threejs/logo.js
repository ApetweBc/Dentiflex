import Image from "next/image";
import logo from "../../public/aurum.png";

export default function Logo () {
  return (
    <Image
    src={logo}
    alt="logo"
    width={233}
    height={239}
    className="absolute bottom-4 right-10"
  />
  
  );
}