import Spinner from "@/ui/Spinner";
import Table from "@/ui/Table";
import Menus from "@/ui/Menus";
import Empty from "@/ui/Empty";
import CabinRow from "./CabinRow";
import { useCabins } from "./useCabins";
import { useSearchParams } from "react-router-dom";
import { Cabin, NumericFieldOfCabin } from "@/types/cabin";

export default function CabinTable() {
  const { isLoading, cabins } = useCabins();
  const [searchParams] = useSearchParams();
  if (isLoading) return <Spinner />;
  if (!cabins?.length) return <Empty resourceName="cabins" />;
  // 삼항연산자 안 써도 앞이 null value면 바로 뒤값을 보여주는 short circuiting
  const filterValue = searchParams.get("discount") || "all";
  let filteredCabins: Cabin[];
  switch (filterValue) {
    case "all":
      filteredCabins = cabins;
      break;
    case "no-discount":
      filteredCabins = cabins.filter((cabin) => cabin.discount === 0);
      break;
    case "with-discount":
      filteredCabins = cabins.filter((cabin) => cabin.discount > 0);
      break;
    default:
      // [TsMigration] Definite Assignment Assertion
      // Default에서도 filteredCabins를 초기화해줘야 한다
      filteredCabins = cabins;
      break;
  }

  const sortBy = searchParams.get("sortBy") || "name-asc";
  // [TsMigration] field가 Cabin의 key이고, number타입의 키만 올 수 있음을 알려줘야 한다
  const [field, direction] = sortBy.split("-") as [NumericFieldOfCabin, string];
  const modifier = direction === "asc" ? 1 : -1;
  const sortedCabins = filteredCabins.sort(
    (a, b) => (a[field] - b[field]) * modifier
  );

  return (
    <Menus>
      <Table columns={"0.6fr 1.8fr 2.2fr 1fr 1fr 1fr"}>
        {/* as는 tag를 아예 바꿔버리지만 role은 바꾸지는 않고, comment의 느낌으로 
        semantic을 보강한다 */}
        <Table.Header role="row">
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={sortedCabins}
          render={(cabin) => <CabinRow key={cabin.id} cabin={cabin}></CabinRow>}
        />
      </Table>
    </Menus>
  );
}
