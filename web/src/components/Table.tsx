export interface TableProps {
    data: any[];
    columns: { key: string; label: string }[];
}

function Table({ data, columns }: TableProps) {
    return <div>Table placeholder</div>;
}
export default Table;
