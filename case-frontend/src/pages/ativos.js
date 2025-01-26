import "../app/globals.css";
import AtivoList from "../components/ativosLista";
import AtivoAdd from "@/components/ativoAdd";

export default function Ativos() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-4">
        <div className="w-1/2"> 
          <AtivoAdd />
        </div>
        <div className="w-1/2">
          <AtivoList />
        </div>
      </div> 
    </div>
  );
}