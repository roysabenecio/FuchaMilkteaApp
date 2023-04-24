import BasicTable from "../../../shared-components/table/table";

const ExistingUserTable = (props: any) => {
    // Table Data
    const rows = props.existingUserFilter;
    const filteredColumns = Object.keys(props.existingUsers[0]).filter(col => col != "isRemoved" && col != "id");
    const columns = () => {
        const tempCol = filteredColumns.map(col =>({
            id: col,
            label: col
        }));
        return tempCol;
    }

    return (
        <BasicTable rows={rows} columns={columns()} maxHeight={10000} maxWidth={10000} tableToModule={props.tableToModule}/>
    );
}

export default ExistingUserTable;