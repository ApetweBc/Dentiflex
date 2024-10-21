import Image from "next/image";
import logoFile from "../../public/aurum.png";

export default function Logo () {
  return (
    <Image
    src={logoFile}
    alt="logo of provider"
    width={233}
    height={239}
    className="absolute bottom-4 right-10"
  />
  
  );
}