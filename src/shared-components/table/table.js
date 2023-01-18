import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const BasicTable = ({
    columns = [],
    rows = [],
    tableToModule,
    maxHeight,
    maxWidth }) => {

    const [selectedID, setSelectedID] = useState(null);
    const [selectedColumns, setSelectedColumns] = useState([
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'code', label: 'Code', minWidth: 100 },
        {
            id: 'population',
            label: 'Population',
            minWidth: 170,
        },
        {
            id: 'variation',
            label: 'Variation',
            minWidth: 170,
        },
        {
            id: 'density',
            label: 'Density',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toFixed(2),
        }]);

    const [selectedRows, setSelectedRows] = useState([
        {
            name: 'SampleName1',
            code: 'SampleCode1',
            variation: 'SampleVariation1',
            population: 'SamplePopulation1',
            density: 'SampleDensity1'
        },
        {
            name: 'SampleName2',
            code: 'SampleCode2',
            variation: 'SampleVariation2',
            population: 'SamplePopulation2',
            density: 'SampleDensity2'
        },]);

    //table head items must always have key's to have uniquness for each items
    //table rows must also have key's  

    useEffect(() => {
        if (rows.length !== 0) {
            setSelectedRows(rows);
        }
        if (columns.length !== 0) {
            setSelectedColumns(columns)
        }
    }, [rows, columns]);

    return (
        <TableContainer sx={{ maxHeight: maxHeight, maxWidth: maxWidth }}>
            <Table stickyHeader >
                <TableHead>
                    <TableRow>
                        {selectedColumns.map((column) => (
                            // column.id !== "id" && column.id !== "password" && column.id !== "isRemoved" ?
                            <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth, fontWeight: 700 }}>
                                {column.label}
                            </TableCell>
                            // : null
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/* onClick event calls the setSelectedID and passes the row ID 
                            and sets it selectedID. We now use the selectedID to compare it to the row ID so that 
                            we can use the "Selected" prop for TableRow */}
                    {selectedRows.map((row, index) => {
                        return <TableRow
                            hover
                            role="checkbox"
                            // key={row.code}
                            key={index}
                            onClick={() => {
                                setSelectedID(row.id)
                                tableToModule(row);
                            }}
                            selected={selectedID === row.id}>
                            {selectedColumns.map((column) => {
                                const value = row[column.id];
                                // console.log("Selected ID: " + selectedID);
                                return (
                                    // column.id !== "id" && column.id !== "password" && column.id !== "isRemoved" ?
                                    <TableCell key={column.id} align={column.align}>
                                        {value}
                                    </TableCell>
                                    // : null
                                )
                            })}
                        </TableRow>
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default BasicTable;