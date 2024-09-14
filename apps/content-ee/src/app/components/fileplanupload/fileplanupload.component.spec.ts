import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FileplanuploadComponent } from "./fileplanupload.component";

describe("FileplanuploadComponent", () => {
  let component: FileplanuploadComponent;
  let fixture: ComponentFixture<FileplanuploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileplanuploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileplanuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
