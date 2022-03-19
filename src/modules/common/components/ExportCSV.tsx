import { CSVLink } from 'react-csv'

interface Props {
    csvData: any;
    fileName: string;
}
export const ExportReactCSV = (props: Props) => {
    const { csvData, fileName } = props;
    return (
        <CSVLink data={csvData} filename={fileName}>Export CSV</CSVLink>
    )
}