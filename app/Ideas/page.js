import ApplicationForm from "../components/ApplicationForm"
import PromoblockVova from "../components/PromoblockVova";
import Information from "../components/Information";


export default function Ideas() {
  return (
    <div>
        <Information />
        <ApplicationForm title="Идеи" description="Здесь можно предложить идею для нашего сообщества" />
        <PromoblockVova />
    </div>
  )
}