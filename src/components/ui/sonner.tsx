import { Toaster as SonnerToaster, type ToasterProps } from "sonner";

const Toaster = (props: ToasterProps) => {
  return (
    <SonnerToaster
      position="top-center"
      className="toaster group"
      richColors
      {...props}
    />
  );
};

export { Toaster };
