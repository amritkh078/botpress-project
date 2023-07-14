// import React, { useState } from 'react'
// import { read, utils } from 'xlsx'
// import { useTable } from 'react-table'

// const FileInput = ({ onFileSelect }) => {
//   const handleFileSelect = e => {
//     const file = e.target.files[0]
//     onFileSelect(file)
//   }

//   return (
//     <div>
//       <input type="file" onChange={handleFileSelect} />
//     </div>
//   )
// }

// const Table = ({ data }) => {
//   const columns = React.useMemo(
//     () =>
//       data[0]
//         ? Object.keys(data[0]).map(key => ({
//             Header: key,
//             accessor: key
//           }))
//         : [],
//     [data]
//   )

//   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
//     columns,
//     data
//   })

//   return (
//     <table {...getTableProps()} className="table">
//       <thead>
//         {headerGroups.map(headerGroup => (
//           <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
//             {headerGroup.headers.map(column => (
//               <th {...column.getHeaderProps()} key={column.id}>
//                 {column.render('Header')}
//               </th>
//             ))}
//           </tr>
//         ))}
//       </thead>
//       <tbody {...getTableBodyProps()}>
//         {rows.map(row => {
//           prepareRow(row)
//           return (
//             <tr {...row.getRowProps()} key={row.id}>
//               {row.cells.map(cell => (
//                 <td {...cell.getCellProps()} key={cell.column.id}>
//                   {cell.render('Cell')}
//                 </td>
//               ))}
//             </tr>
//           )
//         })}
//       </tbody>
//     </table>
//   )
// }

// const App = () => {
//   const [data, setData] = useState([])

//   const handleFileSelect = file => {
//     const reader = new FileReader()

//     reader.onload = e => {
//       const binaryData = e.target.result
//       const workbook = read(binaryData, { type: 'binary' })
//       const worksheetName = workbook.SheetNames[0]
//       const worksheet = workbook.Sheets[worksheetName]
//       const jsonData = utils.sheet_to_json(worksheet, { header: 1 })
//       setData(jsonData)
//     }

//     reader.readAsBinaryString(file)
//   }

//   return (
//     <div className="App">
//       <h1>XLSX File Viewer</h1>
//       <FileInput onFileSelect={handleFileSelect} />
//       <Table data={data} />
//     </div>
//   )
// }

// export default App

// import React, { Component } from 'react'
// import { read, utils } from 'xlsx'

// class XlsxToJsonConverter extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       jsonData: null
//     }
//   }

//   handleFileSelect = e => {
//     const file = e.target.files[0]
//     const reader = new FileReader()

//     reader.onload = e => {
//       const binaryData = e.target.result
//       const workbook = read(binaryData, { type: 'binary' })
//       const worksheetName = workbook.SheetNames[0]
//       const worksheet = workbook.Sheets[worksheetName]
//       const data = utils.sheet_to_json(worksheet, { header: 1 })
//       this.setState({ jsonData: data })
//     }

//     reader.readAsBinaryString(file)
//   }

//   render() {
//     const { jsonData } = this.state

//     return (
//       <div>
//         <input type="file" onChange={this.handleFileSelect} />
//         {jsonData && (
//           <div>
//             <h2>JSON Data:</h2>
//             <pre>{JSON.stringify(jsonData, null, 2)}</pre>
//           </div>
//         )}
//       </div>
//     )
//   }
// }

// class App extends Component {
//   render() {
//     return (
//       <div className="App">
//         <h1>XLSX to JSON Converter</h1>
//         <XlsxToJsonConverter />
//       </div>
//     )
//   }
// }

// export default App

// XLSX to JSON Converter

import React from 'react'
import { read, utils } from 'xlsx'

export default class MyMainView extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.state = {
      result: {},
      file: '',
      data: [],
      headers: []
    }
  }

  handleClick(e) {
    this.refs.fileUploader.click()
  }

  componentDidMount() {
    this.fetch()
  }

  async fetch() {
    const result = await this.props.bp.axios.get('mod/custom/random')
    console.log(result)
    this.setState({ result })
    return result
  }

  filePathSet(e) {
    e.stopPropagation()
    e.preventDefault()
    const file = e.target.files[0]
    this.setState({ file })
  }

  readFile() {
    const file = this.state.file
    const reader = new FileReader()

    reader.onload = evt => {
      const bstr = evt.target.result
      const wb = read(bstr, { type: 'binary' })
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      const data = utils.sheet_to_json(ws, { header: 1 })

      const headers = data[0]
      const tableData = data.slice(1)

      this.setState({ headers, data: this.convertToJson(tableData) })
    }

    reader.readAsBinaryString(file)
  }

  convertToJson(data) {
    const headers = this.state.headers
    const result = []

    for (let i = 0; i < data.length; i++) {
      const obj = {}

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = data[i][j]
      }

      result.push(obj)
    }

    return result
  }

  render() {
    const { headers, data } = this.state

    return (
      <div>
        <h1>{this.state.result.data && this.state.result.data.message}</h1>
        <input type="file" id="file" ref="fileUploader" onChange={this.filePathSet.bind(this)} />
        <button
          onClick={() => {
            this.readFile()
          }}
        >
          Read File
        </button>
        <a href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`} download="data.json">
          Download JSON
        </a>
        <table>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((rowData, index) => (
              <tr key={index}>
                {headers.map((header, index) => (
                  <td key={index}>{rowData[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}
