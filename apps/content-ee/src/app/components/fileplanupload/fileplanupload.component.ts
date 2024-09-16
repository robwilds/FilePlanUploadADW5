import { Component, OnInit, ViewChild } from "@angular/core";
import {
  MatAccordion,
  MatExpansionModule,
  MatExpansionPanel,
} from "@angular/material/expansion";
import { SelectionModel } from "@angular/cdk/collections";
import { MatTableDataSource } from "@angular/material/table";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { NgxCSVtoJSONModule } from "ngx-csvto-json";
import { MatCommonModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonModule } from "@angular/material/button";
export interface FilePlanData {
  position: number;
  grsId: string;
  RecordTitle: string;
  classification: string;
  citation: string;
  Disposition: string;
  retentionYears: string;
  RetentionType: string;
  eventType: string;
  longerRetentionAuth: string;
  deviation: string;
  fullDispoInstruction: string;
  dispositionAuthority: string;
  supersededBy: string;
  lastUpdated: string;
  comments: string;
}
@Component({
  selector: "app-ags-fileupload",
  templateUrl: "./fileplanupload.component.html",
  styleUrls: ["./fileplanupload.component.scss"],
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatExpansionModule,
    MatCheckboxModule,
    NgxCSVtoJSONModule,
    MatCommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
  ],
})
export class FileplanuploadComponent implements OnInit {
  //logic to get list of file plans, categories and children
  //refer to workspace://SpacesStore/0a68a53e-1852-4b6a-a2c5-be2db0334df5 on rwilds232 (record category) in node browser
  // children show the folders and the parent is the actual file plan

  constructor(
    //private ngxCsvParser: NgxCsvParser,
    private http: HttpClient
  ) {}
  confirmMessage = "";
  showFiller = false;
  dataSource: any;
  columnsToDisplay = [];
  rowData;
  csvRecords: any;
  header: boolean = true; //for standard table
  isShowFilePlanForm = false;
  selection = new SelectionModel<FilePlanData>(true, []);
  convertedObj: any = "";
  //apiURL = "http://localhost:9600/createfileplan";
  apiURL =
    window.location.protocol +
    "//" +
    window.location.host.replace(":8080", ":9600").replace(":4200", ":9600") +
    "/createfileplan";

  name = "Angular";

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    }),
  };

  @ViewChild(MatAccordion) accordion: MatAccordion;

  @ViewChild("fileImportInput") fileImportInput: any;
  @ViewChild("importDisplayPanel", { static: true })
  importDisplayPanelElement: MatExpansionPanel;

  @ViewChild("confirmationPanel", { static: true })
  confirmationPanelElement: MatExpansionPanel;

  convert(objArray) {
    console.log(objArray);

    this.columnsToDisplay = objArray.properties;
    this.columnsToDisplay.splice(0, 0, "select");
    this.rowData = objArray.result;
    console.log(this.rowData);
    this.dataSource = new MatTableDataSource<FilePlanData>(this.rowData);

    this.convertedObj = JSON.stringify(objArray, null, 2);

    this.importDisplayPanelElement.open();
  }
  onError(err) {
    this.convertedObj = err;
    console.log(err);
  }

  addFilePlanButtonClick() {
    this.isShowFilePlanForm = !this.isShowFilePlanForm;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    //console.log("selected count -> " + this.selection.selected.length);
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.rowData.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: FilePlanData): string {
    if (!row) {
      return `${this.isAllSelected() ? "deselect" : "select"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${
      row.position + 1
    }`;
  }

  submitFilePlanButton() {
    //console.log(JSON.stringify(this.selection.selected));
    this.confirmationPanelElement.open();
    //now send to microservice
    this.http
      .post(this.apiURL, this.selection.selected, this.httpOptions)
      .subscribe((res) => {
        console.log(
          "api url is--> " +
            this.apiURL +
            "   result is ->>" +
            JSON.stringify(res)
        );

        if (JSON.stringify(res).includes("success")) {
          this.confirmMessage = "File Plans added successfully!";
        } else {
          this.confirmMessage = "There was an error";
        }
      });
  }

  addManualFilePlan() {}

  ngOnInit(): void {}
}
