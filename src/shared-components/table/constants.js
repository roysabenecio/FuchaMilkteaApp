import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import styled from '@emotion/styled';
import { default as color } from '../../util/color-palette';

export const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    color: color.mainText,
    backgroundColor: color.tableHead,
    borderBottom: 'none'
  },
  [`&.${tableCellClasses.body}`]: {
    borderBottom: 'none'
  }
}))