import { Component } from '@angular/core';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
// import { environment } from '../../../environments/environment';
import { environment } from '../../../environments/environment.prod';
import { RouterLink } from '@angular/router';
import { IpaddressService } from '../../ipaddress.service';
// -----------------new code---------------
declare const dhtmlXGridObject: any;
// -----------------new code---------------
@Component({
  selector: 'app-multimerchandise',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, RouterLink],
  templateUrl: './multimerchandise.component.html',
  styleUrl: './multimerchandise.component.scss'
})
export class MultimerchandiseComponent {



  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private ipAddressService: IpaddressService) { }

  ngOnInit(): void {

    this.ipAddressService.getPublicIp().subscribe(
      (response) => {

        let ipAddress = response.ip;
        if (ipAddress) {

          this.ipAddressService.logPageVisit(3, ipAddress)
            .subscribe((response));
        } else {
          console.error('Local IP address not found.');
        }
      },
      (error) => {
        console.error('Error fetching public IP:', error);
      }
    );
  }

  merchandise_id_1: any = ''
  merchandise_id_2: any = ''
  merchandise_id_3: any = ''
  merchandise_id_4: any = ''
  merchandise_id_5: any = ''

  private apiUrl = environment.apiUrl;

  loading: boolean = false
  searchData1: any[] = []
  searchData2: any[] = []
  searchData3: any[] = []
  searchData4: any[] = []
  searchData5: any[] = []
  savedItems: any[] = []
  selectedItems: any[] = []
  private fontkit: any;
  ngAfterViewInit(): void {
    
    this.initGrid1();
    this.initGrid2();
    this.initGrid3();
    this.initGrid4();
    this.initGrid5();
    this.removeDhtmlxSelectedClasses()
  }

  sanitizeHTML(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  async doSearch() {
// Clear existing data
this.grid1.clearAll();
this.grid2.clearAll();
this.grid3.clearAll();
this.grid4.clearAll();
this.grid5.clearAll();
    if (this.merchandise_id_1.trim()) {

      this.loading = true
      const res = await this.searchData(this.merchandise_id_1)
      this.searchData1 = res.map(item => ({
        ...item,
        nonNullAuthorizationNumbers: [
          item.authorization_jis_number_1,
          item.authorization_jis_number_2,
          item.authorization_jis_number_3,
          item.authorization_jis_number_4,
          item.authorization_jis_number_5
        ].filter(num => num !== null && num !== undefined)
      }));

      if (this.searchData1.length === 0) {
        alert("商品番号(1)は該当するデータがありません")
      }else{
        this.updateGrid1()
      }
      this.loading = false
    } else {
      alert("検索条件を入力してください")
    }

    if (this.merchandise_id_2.trim()) {

      this.loading = true
      const res = await this.searchData(this.merchandise_id_2)
      this.searchData2 = res.map(item => ({
        ...item,
        nonNullAuthorizationNumbers: [
          item.authorization_jis_number_1,
          item.authorization_jis_number_2,
          item.authorization_jis_number_3,
          item.authorization_jis_number_4,
          item.authorization_jis_number_5
        ].filter(num => num !== null && num !== undefined)
      }));
      if (this.searchData2.length === 0) {
        alert("商品番号(2)は該当するデータがありません")
      }else{
        this.updateGrid2()
      }

      this.loading = false
    }
    if (this.merchandise_id_3.trim()) {

      this.loading = true
      const res = await this.searchData(this.merchandise_id_3)
      this.searchData3 = res.map(item => ({
        ...item,
        nonNullAuthorizationNumbers: [
          item.authorization_jis_number_1,
          item.authorization_jis_number_2,
          item.authorization_jis_number_3,
          item.authorization_jis_number_4,
          item.authorization_jis_number_5
        ].filter(num => num !== null && num !== undefined)
      }));
      if (this.searchData3.length === 0) {
        alert("商品番号(3)は該当するデータがありません")
      }else{
        this.updateGrid3()
      }
      this.loading = false

    }
    if (this.merchandise_id_4.trim()) {

      this.loading = true
      const res = await this.searchData(this.merchandise_id_4)
      this.searchData4 = res.map(item => ({
        ...item,
        nonNullAuthorizationNumbers: [
          item.authorization_jis_number_1,
          item.authorization_jis_number_2,
          item.authorization_jis_number_3,
          item.authorization_jis_number_4,
          item.authorization_jis_number_5
        ].filter(num => num !== null && num !== undefined)
      }));
      if (this.searchData4.length === 0) {
        alert("商品番号(4)は該当するデータがありません")
      }else{
        this.updateGrid4()
      }
      this.loading = false

    }
    if (this.merchandise_id_5.trim()) {


      const res = await this.searchData(this.merchandise_id_5)
      this.searchData5 = res.map(item => ({
        ...item,
        nonNullAuthorizationNumbers: [
          item.authorization_jis_number_1,
          item.authorization_jis_number_2,
          item.authorization_jis_number_3,
          item.authorization_jis_number_4,
          item.authorization_jis_number_5
        ].filter(num => num !== null && num !== undefined)
      }));
      if (this.searchData5.length === 0) {
        alert("商品番号(5)は該当するデータがありません")
      }else{
        this.updateGrid5()
      }
      this.loading = false
    }
    
    this.removeClassDhtmlx()
  }
// --------------------------------------new for table start---------------------------------------
grid1: any;
grid2: any;
grid3: any;
grid4: any;
grid5: any;

  initGrid1(): void {
    console.log("Initializing grid...");
    this.grid1 = new dhtmlXGridObject('gridbox');
    this.grid1.setImagePath('/path_to_dhtmlx_images/'); // Update the path to your DHTMLX images
    this.grid1.setHeader(',見本帳発行会社 <br> 見本帳名,商品番号,施工条件<br>認定取得者（防火）,防火性能／直張り,#cspan,#cspan,#cspan,JIS認証取得者<br>F★★★★<br>認証番号,大臣認定取得者<br>F★★★★<br>認定番号');
   this.grid1.setInitWidths('59,149,139,141,89,89,89,89,129,129'); // Set column widths
    this.grid1.setColAlign('center,left,center,center,center,center,center,center,center,center');
    this.grid1.setColTypes('ro,ro,ro,ro,ro,ro,ro,ro,ro,ro');
    this.grid1.enableResizing('true,true,true,true,true,true,true,true,true,true'); // Enable resizing
    this.grid1.attachHeader('#rspan,#rspan,#rspan,#rspan,不燃下地,不燃石膏,準不燃,金属,#rspan,#rspan');
    this.grid1.init();
    // Add event listener for row selection
    this.grid1.attachEvent("onRowSelect", (id: any) => {
      this.onRowSelect(id); // Handle row selection
    });
  }
  initGrid2(): void {
    console.log("Initializing grid...");
    this.grid2 = new dhtmlXGridObject('gridbox_2');
    this.grid2.setImagePath('/path_to_dhtmlx_images/'); // Update the path to your DHTMLX images
    this.grid2.setHeader(',見本帳発行会社 <br> 見本帳名,商品番号,施工条件<br>認定取得者（防火）,防火性能／直張り,#cspan,#cspan,#cspan,JIS認証取得者<br>F★★★★<br>認証番号,大臣認定取得者<br>F★★★★<br>認定番号');
   this.grid2.setInitWidths('59,149,139,141,89,89,89,89,129,129'); // Set column widths
    this.grid2.setColAlign('center,left,center,center,center,center,center,center,center,center');
    this.grid2.setColTypes('ro,ro,ro,ro,ro,ro,ro,ro,ro,ro');
    this.grid2.enableResizing('true,true,true,true,true,true,true,true,true,true'); // Enable resizing
    this.grid2.attachHeader('#rspan,#rspan,#rspan,#rspan,不燃下地,不燃石膏,準不燃,金属,#rspan,#rspan');
    this.grid2.setStyle("background-color:#1270b6;color:white; text-align:center;vertical-align:middle;", "","", "");
    this.grid2.init();
    // Add event listener for row selection
    this.grid2.attachEvent("onRowSelect", (id: any) => {
      this.onRowSelect(id); // Handle row selection
    });
  }
  initGrid3(): void {
    console.log("Initializing grid...");
    this.grid3 = new dhtmlXGridObject('gridbox_3');
    this.grid3.setImagePath('/path_to_dhtmlx_images/'); // Update the path to your DHTMLX images
    this.grid3.setHeader(',見本帳発行会社 <br> 見本帳名,商品番号,施工条件<br>認定取得者（防火）,防火性能／直張り,#cspan,#cspan,#cspan,JIS認証取得者<br>F★★★★<br>認証番号,大臣認定取得者<br>F★★★★<br>認定番号');
   this.grid3.setInitWidths('59,149,139,141,89,89,89,89,129,129'); // Set column widths
    this.grid3.setColAlign('center,left,center,center,center,center,center,center,center,center');
    this.grid3.setColTypes('ro,ro,ro,ro,ro,ro,ro,ro,ro,ro');
    this.grid3.enableResizing('true,true,true,true,true,true,true,true,true,true'); // Enable resizing
    this.grid3.attachHeader('#rspan,#rspan,#rspan,#rspan,不燃下地,不燃石膏,準不燃,金属,#rspan,#rspan');
    this.grid3.setStyle("background-color:#1270b6;color:white; text-align:center;vertical-align:middle;", "","", "");
    this.grid3.init();
    // Add event listener for row selection
    this.grid3.attachEvent("onRowSelect", (id: any) => {
      this.onRowSelect(id); // Handle row selection
    });
  }
  initGrid4(): void {
    console.log("Initializing grid...");
    this.grid4 = new dhtmlXGridObject('gridbox_4');
    this.grid4.setImagePath('/path_to_dhtmlx_images/'); // Update the path to your DHTMLX images
    this.grid4.setHeader(',見本帳発行会社 <br> 見本帳名,商品番号,施工条件<br>認定取得者（防火）,防火性能／直張り,#cspan,#cspan,#cspan,JIS認証取得者<br>F★★★★<br>認証番号,大臣認定取得者<br>F★★★★<br>認定番号');
   this.grid4.setInitWidths('59,149,139,141,89,89,89,89,129,129'); // Set column widths
    this.grid4.setColAlign('center,left,center,center,center,center,center,center,center,center');
    this.grid4.setColTypes('ro,ro,ro,ro,ro,ro,ro,ro,ro,ro');
    this.grid4.enableResizing('true,true,true,true,true,true,true,true,true,true'); // Enable resizing
    this.grid4.attachHeader('#rspan,#rspan,#rspan,#rspan,不燃下地,不燃石膏,準不燃,金属,#rspan,#rspan');
    this.grid4.setStyle("background-color:#1270b6;color:white; text-align:center;vertical-align:middle;", "","", "");

    this.grid4.init();
    // Add event listener for row selection
    this.grid4.attachEvent("onRowSelect", (id: any) => {
      this.onRowSelect(id); // Handle row selection
    });
  }
  initGrid5(): void {
    console.log("Initializing grid...");
    this.grid5 = new dhtmlXGridObject('gridbox_5');
    this.grid5.setImagePath('/path_to_dhtmlx_images/'); // Update the path to your DHTMLX images
    this.grid5.setHeader(',見本帳発行会社 <br> 見本帳名,商品番号,施工条件<br>認定取得者（防火）,防火性能／直張り,#cspan,#cspan,#cspan,JIS認証取得者<br>F★★★★<br>認証番号,大臣認定取得者<br>F★★★★<br>認定番号');
   this.grid5.setInitWidths('59,149,139,141,89,89,89,89,129,129'); // Set column widths
    this.grid5.setColAlign('center,left,center,center,center,center,center,center,center,center');
    this.grid5.setColTypes('ro,ro,ro,ro,ro,ro,ro,ro,ro,ro');
    this.grid5.enableResizing('true,true,true,true,true,true,true,true,true,true'); // Enable resizing
    this.grid5.attachHeader('#rspan,#rspan,#rspan,#rspan,不燃下地,不燃石膏,準不燃,金属,#rspan,#rspan');
    this.grid5.setStyle("background-color:#1270b6;color:white; text-align:center;vertical-align:middle;", "","", "");
    this.grid5.init();
    // Add event listener for row selection
    this.grid5.attachEvent("onRowSelect", (id: any) => {
      this.onRowSelect(id); // Handle row selection
    });
  }
  private isAllSelected: boolean = false;

  updateGrid1(): void {
    // Clear existing data
    this.grid1.clearAll();
    // Add new data
    this.searchData1.forEach((item) => {
      const checkboxId = `checkbox-${item.search_unique_code}`;
      const checkboxHtml = `
        <input
          type="checkbox"
          id="${checkboxId}"
        />
      `;
      const rowData = [
        checkboxHtml,
        // sample book name start
        item.company_code!='999' && item.publication_mode !='1' ? `${item.list_sample_book_cm_name}<br> ${item.list_sample_book_name}<span style="color: red;">${this.getMerchandiseSortNumber(item)}</span>` : '',
        // sample book name end
        item.merchandise_id,
        // provisional_fireproofing_company_name start
        item.search_construction_method == '1' &&
          item.provisional_fireproofing_company_name != '' ? `標準施工法<br />${item.provisional_fireproofing_company_name
          }` : item.search_construction_method == '2' ? `  標準施工法タック<br />${item.provisional_fireproofing_company_name
            }` : item.search_construction_method == '3' ? `条件付施工法<br />${item.provisional_fireproofing_company_name
              }` : item.search_construction_method == '4' ? ` 特有の施工法<br />${item.provisional_fireproofing_company_name
                }` : '',
        // provisional_fireproofing_company_name end
        // Fireproof Undercoat column start
        item.fire_performance_fireproof_undercoat === 1
          ? `<div style='color:#ff0000;'>不燃<br>${item.fire_performance_fireproof_undercoat_number}</div>`
          : item.fire_performance_fireproof_undercoat === 2
            ? `<div style='color:#008000;'>準不燃<br>${item.fire_performance_fireproof_undercoat_number}</div>`
            : item.fire_performance_fireproof_undercoat === 3
              ? `<div style='color:#0000ff;'>難燃<br>${item.fire_performance_fireproof_undercoat_number}</div>`
              : '',
        // Fireproof Undercoat column end
        // Fireproof Plaster column start
        item.fire_performance_fireproof_plaster === 1
          ? `<div style='color:#ff0000;'>不燃<br>${item.fire_performance_fireproof_plaster_number}</div>`
          : item.fire_performance_fireproof_plaster === 2
            ? `<div style='color:#008000;'>準不燃<br>${item.fire_performance_fireproof_plaster_number}</div>`
            : item.fire_performance_fireproof_plaster === 3
              ? `<div style='color:#0000ff;'>難燃<br>${item.fire_performance_fireproof_plaster_number}</div>`
              : '',
        // Fireproof Plaster column end
        // Quasi-Incombustible column start
        item.fire_performance_quasi_incombustible === 1
          ? `<div style='color:#ff0000;'>不燃<br>${item.fire_performance_quasi_incombustible_number}</div>`
          : item.fire_performance_quasi_incombustible === 2
            ? `<div style='color:#008000;'>準不燃<br>${item.fire_performance_quasi_incombustible_number}</div>`
            : item.fire_performance_quasi_incombustible === 3
              ? `<div style='color:#0000ff;'>難燃<br>${item.fire_performance_quasi_incombustible_number}</div>`
              : '',
        // Quasi-Incombustible column end
        // Metal column start
        item.fire_performance_metal === 1
          ? `<div style='color:#ff0000;'>不燃<br>${item.fire_performance_metal_number}</div>`
          : item.fire_performance_metal === 2
            ? `<div style='color:#008000;'>準不燃<br>${item.fire_performance_metal_number}</div>`
            : item.fire_performance_metal === 3
              ? `<div style='color:#0000ff;'>難燃<br>${item.fire_performance_metal_number}</div>`
              : '',
        // Metal column end
        item.list_jis_cm_name
          ? `${item.list_jis_cm_name}<br>${item.nonNullAuthorizationNumbers?.join('<br>')}`
          : '',
        item.list_minister_cm_name
          ? `${item.list_minister_cm_name}<br>${item.list_minister_num}`
          : '',
      ];
    
      // Add the row to the grid
      this.grid1.addRow(item.document_id, rowData);
      // Initialize `selected` to false
      item.selected = false;
      // Attach event listener to the checkbox
      setTimeout(() => {
        const checkbox = document.getElementById(checkboxId) as HTMLInputElement;
        if (checkbox) {
          checkbox.addEventListener('change', (event) => this.onCheckboxChangee(event, item));
        }
      });
    });
  }
  updateGrid2(): void {
    // Clear existing data
    this.grid2.clearAll();
    // Add new data
    this.searchData2.forEach((item) => {
      const checkboxId = `checkbox-${item.search_unique_code}`;
      const checkboxHtml = `
        <input
          type="checkbox"
          id="${checkboxId}"
        />
      `;
      const rowData = [
        checkboxHtml,
        // sample book name start
        item.company_code!='999' && item.publication_mode !='1' ? `${item.list_sample_book_cm_name}<br> ${item.list_sample_book_name}<span style="color: red;">${this.getMerchandiseSortNumber(item)}</span>` : '',
        // sample book name end
        item.merchandise_id,
        // provisional_fireproofing_company_name start
        item.search_construction_method == '1' &&
          item.provisional_fireproofing_company_name != '' ? `標準施工法<br />${item.provisional_fireproofing_company_name
          }` : item.search_construction_method == '2' ? `  標準施工法タック<br />${item.provisional_fireproofing_company_name
            }` : item.search_construction_method == '3' ? `条件付施工法<br />${item.provisional_fireproofing_company_name
              }` : item.search_construction_method == '4' ? ` 特有の施工法<br />${item.provisional_fireproofing_company_name
                }` : '',
        // provisional_fireproofing_company_name end
        // Fireproof Undercoat column start
        item.fire_performance_fireproof_undercoat === 1
          ? `<div style='color:#ff0000;'>不燃<br>${item.fire_performance_fireproof_undercoat_number}</div>`
          : item.fire_performance_fireproof_undercoat === 2
            ? `<div style='color:#008000;'>準不燃<br>${item.fire_performance_fireproof_undercoat_number}</div>`
            : item.fire_performance_fireproof_undercoat === 3
              ? `<div style='color:#0000ff;'>難燃<br>${item.fire_performance_fireproof_undercoat_number}</div>`
              : "",
        // Fireproof Undercoat column end
        // Fireproof Plaster column start
        item.fire_performance_fireproof_plaster === 1
          ? `<div style='color:#ff0000;'>不燃<br>${item.fire_performance_fireproof_plaster_number}</div>`
          : item.fire_performance_fireproof_plaster === 2
            ? `<div style='color:#008000;'>準不燃<br>${item.fire_performance_fireproof_plaster_number}</div>`
            : item.fire_performance_fireproof_plaster === 3
              ? `<div style='color:#0000ff;'>難燃<br>${item.fire_performance_fireproof_plaster_number}</div>`
              : "",
        // Fireproof Plaster column end
        // Quasi-Incombustible column start
        item.fire_performance_quasi_incombustible === 1
          ? `<div style='color:#ff0000;'>不燃<br>${item.fire_performance_quasi_incombustible_number}</div>`
          : item.fire_performance_quasi_incombustible === 2
            ? `<div style='color:#008000;'>準不燃<br>${item.fire_performance_quasi_incombustible_number}</div>`
            : item.fire_performance_quasi_incombustible === 3
              ? `<div style='color:#0000ff;'>難燃<br>${item.fire_performance_quasi_incombustible_number}</div>`
              : "",
        // Quasi-Incombustible column end
        // Metal column start
        item.fire_performance_metal === 1
          ? `<div style='color:#ff0000;'>不燃<br>${item.fire_performance_metal_number}</div>`
          : item.fire_performance_metal === 2
            ? `<div style='color:#008000;'>準不燃<br>${item.fire_performance_metal_number}</div>`
            : item.fire_performance_metal === 3
              ? `<div style='color:#0000ff;'>難燃<br>${item.fire_performance_metal_number}</div>`
              : "",
        // Metal column end
        item.list_jis_cm_name
          ? `${item.list_jis_cm_name}<br>${item.nonNullAuthorizationNumbers?.join('<br>')}`
          : '',
        item.list_minister_cm_name
          ? `${item.list_minister_cm_name}<br>${item.list_minister_num}`
          : '',
      ];
    
      // Add the row to the grid
      this.grid2.addRow(item.document_id, rowData);
      // Initialize `selected` to false
      item.selected = false;
      // Attach event listener to the checkbox
      setTimeout(() => {
        const checkbox = document.getElementById(checkboxId) as HTMLInputElement;
        if (checkbox) {
          checkbox.addEventListener('change', (event) => this.onCheckboxChangee(event, item));
        }
      });
    });
  }
  updateGrid3(): void {
    // Clear existing data
    this.grid3.clearAll();
    // Add new data
    this.searchData3.forEach((item) => {
      const checkboxId = `checkbox-${item.search_unique_code}`;
      const checkboxHtml = `
        <input
          type="checkbox"
          id="${checkboxId}"
        />
      `;
      const rowData = [
        checkboxHtml,
        // sample book name start
        item.company_code!='999' && item.publication_mode !='1' ? `${item.list_sample_book_cm_name}<br> ${item.list_sample_book_name}<span style="color: red;">${this.getMerchandiseSortNumber(item)}</span>` : '',
        // sample book name end
        item.merchandise_id,
        // provisional_fireproofing_company_name start
        item.search_construction_method == '1' &&
          item.provisional_fireproofing_company_name != '' ? `標準施工法<br />${item.provisional_fireproofing_company_name
          }` : item.search_construction_method == '2' ? `  標準施工法タック<br />${item.provisional_fireproofing_company_name
            }` : item.search_construction_method == '3' ? `条件付施工法<br />${item.provisional_fireproofing_company_name
              }` : item.search_construction_method == '4' ? ` 特有の施工法<br />${item.provisional_fireproofing_company_name
                }` : '',
        // provisional_fireproofing_company_name end
        // Fireproof Undercoat column start
        item.fire_performance_fireproof_undercoat === 1
          ? `<div style='color:#ff0000;'>不燃<br>${item.fire_performance_fireproof_undercoat_number}</div>`
          : item.fire_performance_fireproof_undercoat === 2
            ? `<div style='color:#008000;'>準不燃<br>${item.fire_performance_fireproof_undercoat_number}</div>`
            : item.fire_performance_fireproof_undercoat === 3
              ? `<div style='color:#0000ff;'>難燃<br>${item.fire_performance_fireproof_undercoat_number}</div>`
              : "",
        // Fireproof Undercoat column end
        // Fireproof Plaster column start
        item.fire_performance_fireproof_plaster === 1
          ? `<div style='color:#ff0000;'>不燃<br>${item.fire_performance_fireproof_plaster_number}</div>`
          : item.fire_performance_fireproof_plaster === 2
            ? `<div style='color:#008000;'>準不燃<br>${item.fire_performance_fireproof_plaster_number}</div>`
            : item.fire_performance_fireproof_plaster === 3
              ? `<div style='color:#0000ff;'>難燃<br>${item.fire_performance_fireproof_plaster_number}</div>`
              : "",
        // Fireproof Plaster column end
        // Quasi-Incombustible column start
        item.fire_performance_quasi_incombustible === 1
          ? `<div style='color:#ff0000;'>不燃<br>${item.fire_performance_quasi_incombustible_number}</div>`
          : item.fire_performance_quasi_incombustible === 2
            ? `<div style='color:#008000;'>準不燃<br>${item.fire_performance_quasi_incombustible_number}</div>`
            : item.fire_performance_quasi_incombustible === 3
              ? `<div style='color:#0000ff;'>難燃<br>${item.fire_performance_quasi_incombustible_number}</div>`
              : "",
        // Quasi-Incombustible column end
        // Metal column start
        item.fire_performance_metal === 1
          ? `<div style='color:#ff0000;'>不燃<br>${item.fire_performance_metal_number}</div>`
          : item.fire_performance_metal === 2
            ? `<div style='color:#008000;'>準不燃<br>${item.fire_performance_metal_number}</div>`
            : item.fire_performance_metal === 3
              ? `<div style='color:#0000ff;'>難燃<br>${item.fire_performance_metal_number}</div>`
              : "",
        // Metal column end
        item.list_jis_cm_name
          ? `${item.list_jis_cm_name}<br>${item.nonNullAuthorizationNumbers?.join('<br>')}`
          : '',
        item.list_minister_cm_name
          ? `${item.list_minister_cm_name}<br>${item.list_minister_num}`
          : '',
      ];
    
      // Add the row to the grid
      this.grid3.addRow(item.document_id, rowData);
      // Initialize `selected` to false
      item.selected = false;
      // Attach event listener to the checkbox
      setTimeout(() => {
        const checkbox = document.getElementById(checkboxId) as HTMLInputElement;
        if (checkbox) {
          checkbox.addEventListener('change', (event) => this.onCheckboxChangee(event, item));
        }
      });
    });
  }
  updateGrid4(): void {
    // Clear existing data
    this.grid4.clearAll();
    // Add new data
    this.searchData4.forEach((item) => {
      const checkboxId = `checkbox-${item.search_unique_code}`;
      const checkboxHtml = `
        <input
          type="checkbox"
          id="${checkboxId}"
        />
      `;
      const rowData = [
        checkboxHtml,
        // sample book name start
        item.company_code!='999' && item.publication_mode !='1' ? `${item.list_sample_book_cm_name}<br> ${item.list_sample_book_name}<span style="color: red;">${this.getMerchandiseSortNumber(item)}</span>` : '',
        // sample book name end
        item.merchandise_id,
        // provisional_fireproofing_company_name start
        item.search_construction_method == '1' &&
          item.provisional_fireproofing_company_name != '' ? `標準施工法<br />${item.provisional_fireproofing_company_name
          }` : item.search_construction_method == '2' ? `  標準施工法タック<br />${item.provisional_fireproofing_company_name
            }` : item.search_construction_method == '3' ? `条件付施工法<br />${item.provisional_fireproofing_company_name
              }` : item.search_construction_method == '4' ? ` 特有の施工法<br />${item.provisional_fireproofing_company_name
                }` : '',
        // provisional_fireproofing_company_name end
        // Fireproof Undercoat column start
        item.fire_performance_fireproof_undercoat === 1
          ? `<div style='color:#ff0000;'>不燃<br>${item.fire_performance_fireproof_undercoat_number}</div>`
          : item.fire_performance_fireproof_undercoat === 2
            ? `<div style='color:#008000;'>準不燃<br>${item.fire_performance_fireproof_undercoat_number}</div>`
            : item.fire_performance_fireproof_undercoat === 3
              ? `<div style='color:#0000ff;'>難燃<br>${item.fire_performance_fireproof_undercoat_number}</div>`
              : "",
        // Fireproof Undercoat column end
        // Fireproof Plaster column start
        item.fire_performance_fireproof_plaster === 1
          ? `<div style='color:#ff0000;'>不燃<br>${item.fire_performance_fireproof_plaster_number}</div>`
          : item.fire_performance_fireproof_plaster === 2
            ? `<div style='color:#008000;'>準不燃<br>${item.fire_performance_fireproof_plaster_number}</div>`
            : item.fire_performance_fireproof_plaster === 3
              ? `<div style='color:#0000ff;'>難燃<br>${item.fire_performance_fireproof_plaster_number}</div>`
              : "",
        // Fireproof Plaster column end
        // Quasi-Incombustible column start
        item.fire_performance_quasi_incombustible === 1
          ? `<div style='color:#ff0000;'>不燃<br>${item.fire_performance_quasi_incombustible_number}</div>`
          : item.fire_performance_quasi_incombustible === 2
            ? `<div style='color:#008000;'>準不燃<br>${item.fire_performance_quasi_incombustible_number}</div>`
            : item.fire_performance_quasi_incombustible === 3
              ? `<div style='color:#0000ff;'>難燃<br>${item.fire_performance_quasi_incombustible_number}</div>`
              : "",
        // Quasi-Incombustible column end
        // Metal column start
        item.fire_performance_metal === 1
          ? `<div style='color:#ff0000;'>不燃<br>${item.fire_performance_metal_number}</div>`
          : item.fire_performance_metal === 2
            ? `<div style='color:#008000;'>準不燃<br>${item.fire_performance_metal_number}</div>`
            : item.fire_performance_metal === 3
              ? `<div style='color:#0000ff;'>難燃<br>${item.fire_performance_metal_number}</div>`
              : "",
        // Metal column end
        item.list_jis_cm_name
          ? `${item.list_jis_cm_name}<br>${item.nonNullAuthorizationNumbers?.join('<br>')}`
          : '',
        item.list_minister_cm_name
          ? `${item.list_minister_cm_name}<br>${item.list_minister_num}`
          : '',
      ];
    
      // Add the row to the grid
      this.grid4.addRow(item.document_id, rowData);
      // Initialize `selected` to false
      item.selected = false;
      // Attach event listener to the checkbox
      setTimeout(() => {
        const checkbox = document.getElementById(checkboxId) as HTMLInputElement;
        if (checkbox) {
          checkbox.addEventListener('change', (event) => this.onCheckboxChangee(event, item));
        }
      });
    });
  }
  updateGrid5(): void {
    // Clear existing data
    this.grid5.clearAll();
    // Add new data
    this.searchData5.forEach((item) => {
      const checkboxId = `checkbox-${item.search_unique_code}`;
      const checkboxHtml = `
        <input
          type="checkbox"
          id="${checkboxId}"
        />
      `;
      const rowData = [
        checkboxHtml,
        // sample book name start
        item.company_code!='999' && item.publication_mode !='1' ? `${item.list_sample_book_cm_name}<br> ${item.list_sample_book_name}<span style="color: red;">${this.getMerchandiseSortNumber(item)}</span>` : '',
        // sample book name end
        item.merchandise_id,
        // provisional_fireproofing_company_name start
        item.search_construction_method == '1' &&
          item.provisional_fireproofing_company_name != '' ? `標準施工法<br />${item.provisional_fireproofing_company_name
          }` : item.search_construction_method == '2' ? `  標準施工法タック<br />${item.provisional_fireproofing_company_name
            }` : item.search_construction_method == '3' ? `条件付施工法<br />${item.provisional_fireproofing_company_name
              }` : item.search_construction_method == '4' ? ` 特有の施工法<br />${item.provisional_fireproofing_company_name
                }` : '',
        // provisional_fireproofing_company_name end
        // Fireproof Undercoat column start
        item.fire_performance_fireproof_undercoat === 1
          ? `<div style='color:#ff0000;'>不燃<br>${item.fire_performance_fireproof_undercoat_number}</div>`
          : item.fire_performance_fireproof_undercoat === 2
            ? `<div style='color:#008000;'>準不燃<br>${item.fire_performance_fireproof_undercoat_number}</div>`
            : item.fire_performance_fireproof_undercoat === 3
              ? `<div style='color:#0000ff;'>難燃<br>${item.fire_performance_fireproof_undercoat_number}</div>`
              : "",
        // Fireproof Undercoat column end
        // Fireproof Plaster column start
        item.fire_performance_fireproof_plaster === 1
          ? `<div style='color:#ff0000;'>不燃<br>${item.fire_performance_fireproof_plaster_number}</div>`
          : item.fire_performance_fireproof_plaster === 2
            ? `<div style='color:#008000;'>準不燃<br>${item.fire_performance_fireproof_plaster_number}</div>`
            : item.fire_performance_fireproof_plaster === 3
              ? `<div style='color:#0000ff;'>難燃<br>${item.fire_performance_fireproof_plaster_number}</div>`
              : "",
        // Fireproof Plaster column end
        // Quasi-Incombustible column start
        item.fire_performance_quasi_incombustible === 1
          ? `<div style='color:#ff0000;'>不燃<br>${item.fire_performance_quasi_incombustible_number}</div>`
          : item.fire_performance_quasi_incombustible === 2
            ? `<div style='color:#008000;'>準不燃<br>${item.fire_performance_quasi_incombustible_number}</div>`
            : item.fire_performance_quasi_incombustible === 3
              ? `<div style='color:#0000ff;'>難燃<br>${item.fire_performance_quasi_incombustible_number}</div>`
              : "",
        // Quasi-Incombustible column end
        // Metal column start
        item.fire_performance_metal === 1
          ? `<div style='color:#ff0000;'>不燃<br>${item.fire_performance_metal_number}</div>`
          : item.fire_performance_metal === 2
            ? `<div style='color:#008000;'>準不燃<br>${item.fire_performance_metal_number}</div>`
            : item.fire_performance_metal === 3
              ? `<div style='color:#0000ff;'>難燃<br>${item.fire_performance_metal_number}</div>`
              : "",
        // Metal column end
        item.list_jis_cm_name
          ? `${item.list_jis_cm_name}<br>${item.nonNullAuthorizationNumbers?.join('<br>')}`
          : '',
        item.list_minister_cm_name
          ? `${item.list_minister_cm_name}<br>${item.list_minister_num}`
          : '',
      ];
    
      // Add the row to the grid
      this.grid5.addRow(item.document_id, rowData);
      // Initialize `selected` to false
      item.selected = false;
      // Attach event listener to the checkbox
      setTimeout(() => {
        const checkbox = document.getElementById(checkboxId) as HTMLInputElement;
        if (checkbox) {
          checkbox.addEventListener('change', (event) => this.onCheckboxChangee(event, item));
        }
      });
    });
  }
  // here solve the comfilict of class
  removeClassDhtmlx(): void {
    const tableElements = document.querySelectorAll('.obj'); // Select all elements with class 'obj'
  
    if (tableElements.length === 0) {
      console.error('Table elements not found');
      return;
    }
  
    tableElements.forEach((tableElement) => {
      const eve_odd = tableElement.querySelectorAll('tbody tr'); // Select all <tr> inside <tbody>
  
      eve_odd.forEach((row) => {
        // Check and replace 'odd_dhx_skyblue' with 'odd_dhx_web'
        if (row.classList.contains('odd_dhx_skyblue')) {
          row.classList.remove('odd_dhx_skyblue');
          row.classList.add('odd_dhx_web');
        }
  
        // Check and replace 'ev_dhx_skyblue' with 'ev_dhx_web'
        if (row.classList.contains('ev_dhx_skyblue')) {
          row.classList.remove('ev_dhx_skyblue');
          row.classList.add('ev_dhx_web');
        }
      });
    });
  }
  
  removeDhtmlxSelectedClasses(): void {
    const tableElement = document.querySelector('.obj'); // Replace '.dhtmlxGrid' with the correct table class or ID
    // console.log('gridboxelement',this.tableElement)
    if (!tableElement) {
      console.error('Table element not found');
      return;
    }
    tableElement.addEventListener('click', () => {
      // Remove 'rowselected' class from all rows
      const selectedRows = tableElement.querySelectorAll('.rowselected');
      selectedRows.forEach(row => row.classList.remove('rowselected'));


      // Remove 'cellselected' class from all cells
      const selectedCells = tableElement.querySelectorAll('.cellselected');
      selectedCells.forEach(cell => cell.classList.remove('cellselected'));
    });
    
    const tableElements = document.querySelectorAll('#gridbox2'); // Select all elements with ID 'gridbox2'

  if (tableElements.length === 0) {
    console.error('Table elements not found');
    return;
  }

  tableElements.forEach((tableElement) => {
    // Remove 'gridbox_dhx_skyblue' class and add 'gridbox_dhx_web'
    const colorChangeElements = tableElement.querySelectorAll('.gridbox_dhx_skyblue');
    colorChangeElements.forEach((row) => {
      row.classList.remove('gridbox_dhx_skyblue');
      row.classList.add('gridbox_dhx_web');
    });
  });
  }
  
  onCheckboxChangee(event: Event, item: any): void {
    const checkbox = event.target as HTMLInputElement;
    console.log("ch", checkbox)
    const isChecked = checkbox.checked;
    // // Update the item's selected state
     item.selected = isChecked;
  }
  selectedRowData: any; // To store the selected row data
  selectedData: any = null
  selectedIndex: number | null = null;
  onRowSelect(id: string): void {
    // Find the selected company from companyList using company_code (row id)
    const selectedAuthorization = this.searchData2.find(item => item.document_id === id);

    if (selectedAuthorization) {
      // Store the selected data
      this.selectedData = selectedAuthorization;
      this.selectedIndex = this.searchData2.indexOf(selectedAuthorization); // Get the index of the selected row

      // Log the selected row data
      console.log(this.selectedData);
    } else {
      console.error('Selected row not found');
    }
  }
  getMerchandiseSortNumber(item: any): string { return item.merchandise_sort_number === 2 ? '(＊)' : ''; }
// -------------------------------------------new for table end------------------------------------------
  saveSession1() {

    this.selectedItems = this.searchData1.filter(item => item.selected);
    if (this.selectedItems && Array.isArray(this.selectedItems) && this.selectedItems.length > 0) {


      const existingItems = sessionStorage.getItem('selectedItems');
      let savedItems = [];
      if (existingItems) {
        try {
          savedItems = JSON.parse(existingItems);
          if (!Array.isArray(savedItems)) {
            savedItems = [];
          }
        } catch (error) {
          console.error('Error parsing existing saved items:', error);
          savedItems = [];
        }
      }

      const savedItemsMap = new Map();
      savedItems.forEach(item => savedItemsMap.set(item.document_id, item)); // Use a unique property to identify duplicates
      this.selectedItems.forEach(item => savedItemsMap.set(item.document_id, item)); // Merge new items

      // Convert map values back to an array
      const uniqueItems = Array.from(savedItemsMap.values());

      // Save the combined items to session storage
      sessionStorage.setItem('selectedItems', JSON.stringify(uniqueItems));

      // Clear selection state in the editable data table
      this.searchData1.forEach(item => item.selected = false);
      alert('保存が完了しました');
    } else {
      alert('選択してください');
    }

  }
  saveSession2() {
    this.selectedItems = this.searchData2.filter(item => item.selected);
    if (this.selectedItems && Array.isArray(this.selectedItems) && this.selectedItems.length > 0) {

      const existingItems = sessionStorage.getItem('selectedItems');
      let savedItems = [];
      if (existingItems) {
        try {
          savedItems = JSON.parse(existingItems);
          if (!Array.isArray(savedItems)) {
            savedItems = [];
          }
        } catch (error) {
          console.error('Error parsing existing saved items:', error);
          savedItems = [];
        }
      }

      // Combine existing items with new selected items
      //const combinedItems = [...savedItems, ...this.selectedItems];
      // Create a map to check for duplicates
      const savedItemsMap = new Map();
      savedItems.forEach(item => savedItemsMap.set(item.document_id, item)); // Use a unique property to identify duplicates
      this.selectedItems.forEach(item => savedItemsMap.set(item.document_id, item)); // Merge new items

      // Convert map values back to an array
      const uniqueItems = Array.from(savedItemsMap.values());

      // Save the combined items to session storage
      sessionStorage.setItem('selectedItems', JSON.stringify(uniqueItems));


      // Clear selection state in the editable data table
      this.searchData2.forEach(item => item.selected = false);
      alert('保存が完了しました');
    } else {
      alert('選択してください');
    }

  }
  saveSession3() {
    this.selectedItems = this.searchData3.filter(item => item.selected);
    if (this.selectedItems && Array.isArray(this.selectedItems) && this.selectedItems.length > 0) {


      const existingItems = sessionStorage.getItem('selectedItems');
      let savedItems = [];
      if (existingItems) {
        try {
          savedItems = JSON.parse(existingItems);
          if (!Array.isArray(savedItems)) {
            savedItems = [];
          }
        } catch (error) {
          console.error('Error parsing existing saved items:', error);
          savedItems = [];
        }
      }

      // Combine existing items with new selected items
      //const combinedItems = [...savedItems, ...this.selectedItems];
      // Create a map to check for duplicates
      const savedItemsMap = new Map();
      savedItems.forEach(item => savedItemsMap.set(item.document_id, item)); // Use a unique property to identify duplicates
      this.selectedItems.forEach(item => savedItemsMap.set(item.document_id, item)); // Merge new items

      // Convert map values back to an array
      const uniqueItems = Array.from(savedItemsMap.values());

      // Save the combined items to session storage
      sessionStorage.setItem('selectedItems', JSON.stringify(uniqueItems));


      // Clear selection state in the editable data table
      this.searchData3.forEach(item => item.selected = false);
      alert('保存が完了しました');
    } else {
      alert('選択してください');
    }

  }
  saveSession4() {
    this.selectedItems = this.searchData4.filter(item => item.selected);
    if (this.selectedItems && Array.isArray(this.selectedItems) && this.selectedItems.length > 0) {


      const existingItems = sessionStorage.getItem('selectedItems');
      let savedItems = [];
      if (existingItems) {
        try {
          savedItems = JSON.parse(existingItems);
          if (!Array.isArray(savedItems)) {
            savedItems = [];
          }
        } catch (error) {
          console.error('Error parsing existing saved items:', error);
          savedItems = [];
        }
      }

      // Combine existing items with new selected items
      //const combinedItems = [...savedItems, ...this.selectedItems];
      // Create a map to check for duplicates
      const savedItemsMap = new Map();
      savedItems.forEach(item => savedItemsMap.set(item.document_id, item)); // Use a unique property to identify duplicates
      this.selectedItems.forEach(item => savedItemsMap.set(item.document_id, item)); // Merge new items

      // Convert map values back to an array
      const uniqueItems = Array.from(savedItemsMap.values());

      // Save the combined items to session storage
      sessionStorage.setItem('selectedItems', JSON.stringify(uniqueItems));


      // Clear selection state in the editable data table
      this.searchData4.forEach(item => item.selected = false);
      alert('保存が完了しました');
    } else {
      alert('選択してください');
    }

  }
  saveSession5() {
    this.selectedItems = this.searchData5.filter(item => item.selected);
    if (this.selectedItems && Array.isArray(this.selectedItems) && this.selectedItems.length > 0) {


      const existingItems = sessionStorage.getItem('selectedItems');
      let savedItems = [];
      if (existingItems) {
        try {
          savedItems = JSON.parse(existingItems);
          if (!Array.isArray(savedItems)) {
            savedItems = [];
          }
        } catch (error) {
          console.error('Error parsing existing saved items:', error);
          savedItems = [];
        }
      }

      // Combine existing items with new selected items
      //const combinedItems = [...savedItems, ...this.selectedItems];
      // Create a map to check for duplicates
      // const savedItemsMap = new Map();
      // savedItems.forEach(item => savedItemsMap.set(item.merchandise_id, item)); // Use a unique property to identify duplicates
      // this.selectedItems.forEach(item => savedItemsMap.set(item.merchandise_id, item)); // Merge new items
      const savedItemsMap = new Map();
      savedItems.forEach(item => savedItemsMap.set(item.document_id, item)); // Use a unique property to identify duplicates
      this.selectedItems.forEach(item => savedItemsMap.set(item.document_id, item)); // Merge new items


      // Convert map values back to an array
      const uniqueItems = Array.from(savedItemsMap.values());

      // Save the combined items to session storage
      sessionStorage.setItem('selectedItems', JSON.stringify(uniqueItems));



      // Clear selection state in the editable data table
      this.searchData5.forEach(item => item.selected = false);
      alert('保存が完了しました');
    } else {
      alert('選択してください');
    }

  }

  showSession() {

    const savedItems = sessionStorage.getItem('selectedItems');

    if (savedItems) {
      try {
        this.savedItems = JSON.parse(savedItems);
        if (!Array.isArray(this.savedItems)) {
          this.savedItems = [];

        } else {

          // Save the sanitized items to sessionStorage
          sessionStorage.setItem('sanitizedItems', JSON.stringify(this.savedItems));

          const iframeUrl = '/Hekisou/t';

          // Open the DHTMLX window
          const dhx = (window as any).dhx;
          const dhxWindow = new dhx.Window({
            width: 1200,
            height: 650,
            title: '保存表示画面',
            header: true,
            closable: true,
            movable: true,
            css: "custom",
            html: `<iframe src="${iframeUrl}" style="width: 100%; height: 100%; border: none;" allowfullscreen></iframe>`
          });

          // // Add items to the footer
          dhxWindow.header.data.add({ icon: 'dxi dxi-arrow-expand', id: 'fullscreen' }, 2);

          let isFullScreen = false;

          // Handle header icon click for fullscreen
          dhxWindow.header.events.on('click', function (id: string) {

            if (id === 'fullscreen') {
              if (isFullScreen) {
                dhxWindow.unsetFullScreen();
              } else {
                dhxWindow.setFullScreen();
              }
              isFullScreen = !isFullScreen;
            }
          });
          // Create and add the semi-transparent overlay
          const overlay = document.createElement('div');
          overlay.style.position = 'fixed';
          overlay.style.top = '0';
          overlay.style.left = '0';
          overlay.style.width = '100%';
          overlay.style.height = '100%';
          overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
          overlay.style.zIndex = '999'; // Ensure it is above other elements
          document.body.appendChild(overlay);
          // Event listeners for window actions
          window.addEventListener('message', (event) => {
            if (event.data === 'removeWindow' || event.data === 'resetWindow') {
              dhxWindow.hide();
              if (document.body.contains(overlay)) {
                document.body.removeChild(overlay); // Remove overlay when window is closed
              }
            }
          });
          dhxWindow.header.events.on('click', function (id: string) {

            if (id === 'close') {
              // console.log("test")
              if (document.body.contains(overlay)) {
                document.body.removeChild(overlay); // Remove overlay when window is closed
              }
            }
          });



          dhxWindow.show();


        }
      } catch (error) {
        console.error('Error parsing saved items:', error);
        this.savedItems = [];
      }
    } else {
      this.savedItems = [];

      alert("検索結果が見つかりません");

    }
  }

  async downloadpdf1() {
    this.selectedItems = this.searchData1.filter(item => item.selected);
    try {
      const fontkitModule = await import('fontkit');
      this.fontkit = fontkitModule.default || fontkitModule;


      const existingPdfBytes = await fetch('/assets/template_pdf/template.pdf').then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      pdfDoc.registerFontkit(this.fontkit);


      const fontBytes = await fetch('assets/fonts/MSMINCHO.TTF').then(res => res.arrayBuffer());
      const font = await pdfDoc.embedFont(fontBytes);


      if (this.selectedItems.length === 0) {

        alert('選択してください');
        return;
      }


      //const page = pdfDoc.addPage(templatePage);
      for (const [index, item] of this.selectedItems.entries()) {

        const [templatePage] = await pdfDoc.copyPages(pdfDoc, [0]);
        const page = pdfDoc.addPage(templatePage);

        this.drawTextOnPage(page, item, font);
      }
      pdfDoc.removePage(0);


      const fileName = this.selectedItems.map(item => item.merchandise_id).join('_') + '.pdf';
      pdfDoc.setTitle(fileName)
      const pdfBytes = await pdfDoc.save();
      this.downloadPdf(pdfBytes, fileName);

    } catch (error) {
      console.error('Failed to import fontkit:', error);
    }

  }
  async downloadpdf2() {
    this.selectedItems = this.searchData2.filter(item => item.selected);
    try {
      const fontkitModule = await import('fontkit');
      this.fontkit = fontkitModule.default || fontkitModule;


      const existingPdfBytes = await fetch('/assets/template_pdf/template.pdf').then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      pdfDoc.registerFontkit(this.fontkit);


      const fontBytes = await fetch('assets/fonts/MSMINCHO.TTF').then(res => res.arrayBuffer());
      const font = await pdfDoc.embedFont(fontBytes);


      if (this.selectedItems.length === 0) {

        alert('選択してください');
        return;
      }


      //const page = pdfDoc.addPage(templatePage);
      for (const [index, item] of this.selectedItems.entries()) {

        const [templatePage] = await pdfDoc.copyPages(pdfDoc, [0]);
        const page = pdfDoc.addPage(templatePage);

        this.drawTextOnPage(page, item, font);
      }
      pdfDoc.removePage(0);


      const fileName = this.selectedItems.map(item => item.merchandise_id).join('_') + '.pdf';
      pdfDoc.setTitle(fileName)
      const pdfBytes = await pdfDoc.save();
      this.downloadPdf(pdfBytes, fileName);

    } catch (error) {
      console.error('Failed to import fontkit:', error);
    }

  }
  async downloadpdf3() {
    this.selectedItems = this.searchData3.filter(item => item.selected);
    try {
      const fontkitModule = await import('fontkit');
      this.fontkit = fontkitModule.default || fontkitModule;


      const existingPdfBytes = await fetch('/assets/template_pdf/template.pdf').then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      pdfDoc.registerFontkit(this.fontkit);


      const fontBytes = await fetch('assets/fonts/MSMINCHO.TTF').then(res => res.arrayBuffer());
      const font = await pdfDoc.embedFont(fontBytes);


      if (this.selectedItems.length === 0) {

        alert('選択してください');
        return;
      }


      //const page = pdfDoc.addPage(templatePage);
      for (const [index, item] of this.selectedItems.entries()) {

        const [templatePage] = await pdfDoc.copyPages(pdfDoc, [0]);
        const page = pdfDoc.addPage(templatePage);

        this.drawTextOnPage(page, item, font);
      }
      pdfDoc.removePage(0);


      const fileName = this.selectedItems.map(item => item.merchandise_id).join('_') + '.pdf';
      pdfDoc.setTitle(fileName)
      const pdfBytes = await pdfDoc.save();
      this.downloadPdf(pdfBytes, fileName);

    } catch (error) {
      console.error('Failed to import fontkit:', error);
    }

  }
  async downloadpdf4() {
    this.selectedItems = this.searchData4.filter(item => item.selected);
    try {
      const fontkitModule = await import('fontkit');
      this.fontkit = fontkitModule.default || fontkitModule;


      const existingPdfBytes = await fetch('/assets/template_pdf/template.pdf').then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      pdfDoc.registerFontkit(this.fontkit);


      const fontBytes = await fetch('assets/fonts/MSMINCHO.TTF').then(res => res.arrayBuffer());
      const font = await pdfDoc.embedFont(fontBytes);


      if (this.selectedItems.length === 0) {

        alert('選択してください');
        return;
      }


      //const page = pdfDoc.addPage(templatePage);
      for (const [index, item] of this.selectedItems.entries()) {

        const [templatePage] = await pdfDoc.copyPages(pdfDoc, [0]);
        const page = pdfDoc.addPage(templatePage);

        this.drawTextOnPage(page, item, font);
      }
      pdfDoc.removePage(0);


      const fileName = this.selectedItems.map(item => item.merchandise_id).join('_') + '.pdf';
      pdfDoc.setTitle(fileName)
      const pdfBytes = await pdfDoc.save();
      this.downloadPdf(pdfBytes, fileName);

    } catch (error) {
      console.error('Failed to import fontkit:', error);
    }

  }
  async downloadpdf5() {
    this.selectedItems = this.searchData5.filter(item => item.selected);
    try {
      const fontkitModule = await import('fontkit');
      this.fontkit = fontkitModule.default || fontkitModule;


      const existingPdfBytes = await fetch('/assets/template_pdf/template.pdf').then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      pdfDoc.registerFontkit(this.fontkit);


      const fontBytes = await fetch('assets/fonts/MSMINCHO.TTF').then(res => res.arrayBuffer());
      const font = await pdfDoc.embedFont(fontBytes);


      if (this.selectedItems.length === 0) {

        alert('選択してください');
        return;
      }


      //const page = pdfDoc.addPage(templatePage);
      for (const [index, item] of this.selectedItems.entries()) {

        const [templatePage] = await pdfDoc.copyPages(pdfDoc, [0]);
        const page = pdfDoc.addPage(templatePage);

        this.drawTextOnPage(page, item, font);
      }
      pdfDoc.removePage(0);


      const fileName = this.selectedItems.map(item => item.merchandise_id).join('_') + '.pdf';
      pdfDoc.setTitle(fileName)
      const pdfBytes = await pdfDoc.save();
      this.downloadPdf(pdfBytes, fileName);

    } catch (error) {
      console.error('Failed to import fontkit:', error);
    }

  }

  async drawTextOnPage(page: any, writeData: any, font: any) {
    const defaultFontSize = 12;
    let fontSize: number;
    let x_axis: number;
    // Draw merchandise_id
    const merchandiseIdLength = writeData.merchandise_id.length;
    if (writeData.merchandise_id != null && merchandiseIdLength > 29) {
      fontSize = 6;
      x_axis = 60
    } else if (writeData.merchandise_id != null && merchandiseIdLength > 25) {
      fontSize = 7;
      x_axis = 60
    } else if (writeData.merchandise_id != null && merchandiseIdLength > 20) {
      fontSize = 8;
      x_axis = 60
    } else if (writeData.merchandise_id != null && merchandiseIdLength > 16) {
      fontSize = 8;
      x_axis = 80
    } else if (merchandiseIdLength > 12) {
      fontSize = 10;
      x_axis = 90
    } else {
      fontSize = 12;
      x_axis = 100
    }
    page.drawText(writeData.merchandise_id, {
      x: x_axis,
      y: 660,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });


    const isJapanese = /[\u3040-\u30FF\u4E00-\u9FFF]/.test(writeData.list_sample_book_name);
    // text
    if (isJapanese) {

      // Rules for Japanese text
      if (writeData.list_sample_book_name.length >= 45) {

        fontSize = 5;
        x_axis = 195;
      } else if (writeData.list_sample_book_name.length >= 30) {

        fontSize = 6;
        x_axis = 190;
      } else if (writeData.list_sample_book_name.length >= 24) {

        fontSize = 7;
        x_axis = 195;
      } else if (writeData.list_sample_book_name.length >= 22) {

        fontSize = 7;
        x_axis = 198;
      } else if (writeData.list_sample_book_name.length >= 20) {

        fontSize = 7;
        x_axis = 200;
      } else if (writeData.list_sample_book_name.length >= 18) {

        fontSize = 7;
        x_axis = 205;
      } else if (writeData.list_sample_book_name.length >= 16) {

        fontSize = 8;
        x_axis = 205;
      } else if (writeData.list_sample_book_name.length >= 12) {

        fontSize = 8;
        x_axis = 210;
      } else if (writeData.list_sample_book_name.length >= 10) {

        fontSize = 9;
        x_axis = 225;
      } else {

        fontSize = 10;
        x_axis = 225;
      }
    } else {

      // Rules for English text
      if (writeData.list_sample_book_name.length >= 49) {
        fontSize = 5;
        x_axis = 195;
      } else if (writeData.list_sample_book_name.length >= 36) {
        fontSize = 6;
        x_axis = 195;
      } else if (writeData.list_sample_book_name.length >= 30) {
        fontSize = 7;
        x_axis = 198;
      } else if (writeData.list_sample_book_name.length >= 24) {
        fontSize = 9;
        x_axis = 200;
      } else if (writeData.list_sample_book_name.length >= 18) {
        fontSize = 9;
        x_axis = 210;
      } else if (writeData.list_sample_book_name.length > 12) {
        fontSize = 10;
        x_axis = 215;
      } else if (writeData.list_sample_book_name.length > 10) {
        fontSize = 11;
        x_axis = 220;
      } else {
        fontSize = 12;
        x_axis = 223;
      }
    }


    if (writeData.company_code != '999' && writeData.publication_mode != '1') {
      // Draw other text fields
      page.drawText(writeData.list_sample_book_name, {
        x: x_axis,
        y: 660,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });


      if (writeData.regist_company_name != null && writeData.regist_company_name.length >= 28) {

        page.drawText(`${writeData.regist_company_name}`, {
          x: 350,
          y: 660,
          size: 6,
          font: font,
          color: rgb(0, 0, 0),
        });
      } else if (writeData.regist_company_name != null && writeData.regist_company_name.length > 22) {

        page.drawText(`${writeData.regist_company_name}`, {
          x: 370,
          y: 660,
          size: 6,
          font: font,
          color: rgb(0, 0, 0),
        });
      } else if (writeData.regist_company_name != null && writeData.regist_company_name.length >= 20) {

        page.drawText(`${writeData.regist_company_name}`, {
          x: 370,
          y: 660,
          size: 7,
          font: font,
          color: rgb(0, 0, 0),
        });
      } else if (writeData.regist_company_name != null && writeData.regist_company_name.length > 16) {
        page.drawText(`${writeData.regist_company_name}`, {
          x: 370,
          y: 660,
          size: 8,
          font: font,
          color: rgb(0, 0, 0),
        });

      } else if (writeData.regist_company_name != null && writeData.regist_company_name.length > 12) {
        page.drawText(`${writeData.regist_company_name}`, {
          x: 380,
          y: 660,
          size: 10,
          font: font,
          color: rgb(0, 0, 0),
        });

      } else {

        page.drawText(`${writeData.regist_company_name}`, {
          x: 390,
          y: 660,
          size: 12,
          font: font,
          color: rgb(0, 0, 0),
        });
      }


    }






    if (writeData.list_jis_cm_name != null && writeData.list_jis_cm_name.length >= 30) {

      fontSize = 4.8;
      x_axis = 393
    } else if (writeData.list_jis_cm_name != null && writeData.list_jis_cm_name.length >= 25) {

      fontSize = 5;
      x_axis = 395
    } else if (writeData.list_jis_cm_name != null && writeData.list_jis_cm_name.length >= 22) {

      fontSize = 6;
      x_axis = 395
    } else if (writeData.list_jis_cm_name != null && writeData.list_jis_cm_name.length >= 20) {

      fontSize = 7;
      x_axis = 395
    } else if (writeData.list_jis_cm_name != null && writeData.list_jis_cm_name.length > 16) {

      x_axis = 395;
      fontSize = 8;

    } else if (writeData.list_jis_cm_name != null && writeData.list_jis_cm_name.length >= 10) {

      x_axis = 405;
      fontSize = 10;

    } else {

      x_axis = 415;
      fontSize = 12;
    }

    // Conditional data for JIS and Minister
    const jisNumbers = [
      writeData.authorization_jis_number_1,
      writeData.authorization_jis_number_2,
      writeData.authorization_jis_number_3,
      writeData.authorization_jis_number_4,
      writeData.authorization_jis_number_5
    ].filter(num => num);

    let yOffset = 585;
    jisNumbers.forEach((num: string) => {

      page.drawText(`JIS認証           ${num}`, {
        x: 88,
        y: yOffset,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });
      page.drawText(`F★★★★`, {
        x: 312,
        y: yOffset,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });
      page.drawText(`${writeData.list_jis_cm_name}`, {
        x: x_axis,
        y: yOffset,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });
      yOffset -= 20;
    });

    if (writeData.list_minister_cm_name != null && writeData.list_minister_cm_name.length >= 30) {

      fontSize = 4.8;
      x_axis = 393
    } else if (writeData.list_minister_cm_name != null && writeData.list_minister_cm_name.length >= 25) {

      fontSize = 5;
      x_axis = 395
    } else if (writeData.list_minister_cm_name != null && writeData.list_minister_cm_name.length >= 22) {

      fontSize = 6;
      x_axis = 395
    } else if (writeData.list_minister_cm_name != null && writeData.list_minister_cm_name.length >= 20) {

      fontSize = 7;
      x_axis = 395
    } else if (writeData.list_minister_cm_name != null && writeData.list_minister_cm_name.length > 16) {

      x_axis = 395;
      fontSize = 8;

    } else if (writeData.list_minister_cm_name != null && writeData.list_minister_cm_name.length >= 10) {

      x_axis = 405;
      fontSize = 10;

    } else {

      x_axis = 415;
      fontSize = 12;
    }

    if (writeData.list_minister_num) {
      page.drawText(`大臣認定          ${writeData.list_minister_num}`, {
        x: 86,
        y: yOffset,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });
      page.drawText(`F★★★★`, {
        x: 312,
        y: yOffset,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });
      page.drawText(`${writeData.list_minister_cm_name}`, {
        x: x_axis,
        y: yOffset,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });
      yOffset -= 20;
    }

    if (writeData.search_construction_method == '1') {

      page.drawText(`施工条件  :  標準施工法`, {
        x: 250,
        y: 486,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });

    }
    if (writeData.search_construction_method == '2') {

      page.drawText(`施工条件  :  標準施工法タック`, {
        x: 250,
        y: 486,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });

    }
    if (writeData.search_construction_method == '3') {

      page.drawText(`施工条件  :  条件付施工法`, {
        x: 250,
        y: 486,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });

    }
    if (writeData.search_construction_method == '4') {

      page.drawText(`施工条件  :  特有の施工法`, {
        x: 250,
        y: 486,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });

    }



    if (writeData.provisional_fireproofing_company_name != null && writeData.provisional_fireproofing_company_name.length >= 30) {

      fontSize = 4.8;
      x_axis = 393
    } else if (writeData.provisional_fireproofing_company_name != null && writeData.provisional_fireproofing_company_name.length >= 25) {

      fontSize = 5;
      x_axis = 395
    } else if (writeData.provisional_fireproofing_company_name != null && writeData.provisional_fireproofing_company_name.length >= 22) {

      fontSize = 6;
      x_axis = 395
    } else if (writeData.provisional_fireproofing_company_name != null && writeData.provisional_fireproofing_company_name.length >= 20) {

      fontSize = 7;
      x_axis = 395
    } else if (writeData.provisional_fireproofing_company_name != null && writeData.provisional_fireproofing_company_name.length > 16) {

      x_axis = 395;
      fontSize = 8;

    } else if (writeData.provisional_fireproofing_company_name != null && writeData.provisional_fireproofing_company_name.length >= 10) {

      x_axis = 405;
      fontSize = 10;

    } else {

      x_axis = 415;
      fontSize = 12;
    }



    const yAxisMapping = {
      fireproof_undercoat: 450,
      fireproof_plaster: 430,
      quasi_incombustible: 410,
      fire_performance_metal: 390,
    };

    const dataMapping = [
      {
        key: 'fire_performance_fireproof_undercoat',
        label: '不燃下地',
        xAxis: 83,
        yAxis: yAxisMapping.fireproof_undercoat,
        values: ['不燃', '準不燃', '難燃'],
        numberKey: 'fire_performance_fireproof_undercoat_number',
      },
      {
        key: 'fire_performance_fireproof_plaster',
        label: '不燃石膏',
        xAxis: 83,
        yAxis: yAxisMapping.fireproof_plaster,
        values: ['不燃', '準不燃', '難燃'],
        numberKey: 'fire_performance_fireproof_plaster_number',
      },
      {
        key: 'fire_performance_quasi_incombustible',
        label: '準不燃下地',
        xAxis: 79,
        yAxis: yAxisMapping.quasi_incombustible,
        values: ['不燃', '準不燃', '難燃'],
        numberKey: 'fire_performance_quasi_incombustible_number',
      },
      {
        key: 'fire_performance_metal',
        label: '金属',
        xAxis: 92,
        yAxis: yAxisMapping.fire_performance_metal,
        values: ['不燃', '準不燃', '難燃'],
        numberKey: 'fire_performance_metal_number',
      },
    ];

    const yAxisStart = 450; // Start from the highest yAxis position
    const yAxisStep = 20;   // Step size for decrementing the yAxis
    let currentYAxis = yAxisStart;

    dataMapping.forEach(({ key, label, xAxis, values, numberKey }) => {
      const performance = writeData[key];
      if (performance) {
        // Determine the x-axis dynamically based on the value
        const xAxisValue = values[performance - 1] === '準不燃' ? 238 : 245;
        page.drawText(label, { x: xAxis, y: currentYAxis, size: 12, font, color: rgb(0, 0, 0) });
        page.drawText('直張り', { x: 170, y: currentYAxis, size: 12, font, color: rgb(0, 0, 0) });
        page.drawText(values[performance - 1], { x: xAxisValue, y: currentYAxis, size: 12, font, color: rgb(0, 0, 0) });
        page.drawText(writeData[numberKey], { x: 320, y: currentYAxis, size: 12, font, color: rgb(0, 0, 0) });
        page.drawText(writeData.provisional_fireproofing_company_name, {
          x: x_axis, // Adjust x-coordinate dynamically
          y: currentYAxis,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });

        // Decrement the y-axis for the next entry
        currentYAxis -= yAxisStep;
      }
    });
    if (writeData.company_code != '999' && writeData.publication_mode != '1') {

      page.drawText(`${writeData.regist_company_name}`, {
        x: 60,
        y: 238,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });
      page.drawText(`電話番号 ：${writeData.company_reference_tel}`, {
        x: 60,
        y: 226,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });

    }


    // Date and time in JST
    // set Japaniese local time -------------------- 
    const date = new Date().toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    // Parse the date and time components
    const [fullDate, fullTime] = date.split(' ');
    const [year, month, day] = fullDate.split('/');
    const [hour, minute, second] = fullTime.split(':');

    // Format the date as per Japanese standards
    const formattedDate = `${year}年${month}月${day}日 ${hour}:${minute}:${second}`;

    // Draw date on page
    page.drawText(formattedDate, {
      x: 60,
      y: 135,
      size: 13,
      font: font,
      color: rgb(0, 0, 0),
    });

  }

  private downloadPdf(pdfBytes: Uint8Array, fileName: any) {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }



  private async searchData(merchandise_id: any): Promise<any[]> {
    const params = new URLSearchParams();
    if (merchandise_id) params.append('merchandise_id', merchandise_id);
    // Ensure the base URL is correct for the API endpoint
    const fetchApi = `${this.apiUrl}fetch_marchendise?${params.toString()}`;


    return firstValueFrom(this.http.get<any[]>(fetchApi));
  }

}
