import ClientManager from "../components/clienteAdd";
import ClienteList from "../components/clientesLista";

export default function Home() {
  return (
      <div className="flex flex-col gap-4 p-4">
        {/* Linha com ClientManager e ClienteList lado a lado */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <ClientManager />
          </div>
          <div className="w-1/2">
            <ClienteList />
          </div>
        </div>
      </div>
  );
}