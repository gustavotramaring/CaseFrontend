import ClientManager from "./pages/clienteAdd";
import ClienteList from "./pages/clientesLista";

export default function Home() {
  return (
    <div>
      <ClientManager />
      <ClienteList />
    </div>
  );
}
