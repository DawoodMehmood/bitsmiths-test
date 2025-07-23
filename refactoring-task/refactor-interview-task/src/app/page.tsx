import Table, { Issue } from "./components/table";
import issuesData from "./constants/issues.json";

export default function Home() {
  return <Table issues={issuesData as Issue[]} />;
}
