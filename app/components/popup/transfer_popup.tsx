import User from "@/util/next_models/user";
import { useEffect, useRef, useState } from "react";
import { Principal } from "@dfinity/principal";

type TransferProps = {
  onSuccess: () => void;
  onCancel: () => void;
  senderIdentity: any;
  certificateId: any;
  user: User;
  onError: (err: string) => void
};

const TransferPopUp: React.FC<TransferProps> = ({
  onSuccess,
  onCancel,
  senderIdentity,
  certificateId,
  user,
  onError
}) => {
  const [receiverIdentity, setReceiverIdentity] = useState<string>('');
  const ref = useRef<HTMLDivElement>(null);

  const handleTransfer = async  () => {
    // Lakukan logika transfer disini dengan menggunakan receiverIdentity dan senderIdentity
    // Setelah transfer selesai, panggil onSuccess
    try {
       // console.log(senderIdentity)
        console.log('INI SENDER IDENTITY DALAM PRINCIPAL -> ', senderIdentity)
        console.log('INI RECEIVER IDENTITY-> ',receiverIdentity)
        console.log(certificateId)


       // console.log('INI PRINCIPAL DARI RECEIVER -> ',receiverPrincipal)
        await user.actor?.transferFrom(senderIdentity,Principal.fromText(receiverIdentity), certificateId);
        console.log('SUCCESS')
        onSuccess();
    } catch (error) {
        const err : any =  error
        console.log(error)
        onError(err.message||"An error occurred while transferring the certificate.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onCancel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onCancel]);

  return (
    <div className="fixed top-1/2 left-1/2 z-20 bg-slate-800 transform -translate-x-1/2 -translate-y-1/2 text-white rounded-lg p-8" ref={ref}>
      <button
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        onClick={onCancel}
      >
        X
      </button>
      <h2 className="text-2xl font-bold mb-4">Transfer Certificate</h2>
      <div className="mb-4">
        <label className="block mb-2">Receiver Identity:</label>
        <input
          type="text"
          value={receiverIdentity}
          onChange={(e) => setReceiverIdentity(e.target.value)}
          className=" bg-slate-700 text-white rounded-md px-3 py-2 w-full"
        />
      </div>
      <button
        onClick={handleTransfer}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2 w-full"
      >
        Transfer
      </button>
    </div>
  );
};

export default TransferPopUp;
