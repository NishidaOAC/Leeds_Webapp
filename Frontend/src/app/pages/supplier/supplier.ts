import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SupplierService } from './services/supplier.service';
import { SupplierList } from './supplier-list/supplier-list';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, MatSnackBarModule],
  templateUrl: './supplier.html',
  styleUrl: './supplier.scss',
})
export class Supplier implements OnInit {
  step: number = 1;
  isListView: boolean = false;
  loading: boolean = false;
  isRareCase: boolean = false;
  supplierData: any;

  onboardingStatuses: any[] = [];
  selectedStatusId: number | null = null;
readonly CERT_OPTIONS = [
  'FAA AC 00-56 B ACCREDITED',
  'AFRA ACCREDITED',
  'AIRLINE',
  'REPAIR STATION/AMO',
  'OEM OR THEIR AUTHORIZED DISTRIBUTOR',
  'ISO/AS/EN',
 
];


// --- UPDATE THIS SECTION AT THE TOP OF YOUR CLASS ---
form = {
  id: null as number | null,
  name: '',
  email: '',
  hasCert: true,
  poNumber: '',
  poDate: '',
tradeReferences: [
    { companyName: '', email: '', phone: '', response: '' } // Start with only one
  ],
  evaluationFile: null as File | null,
  
  // ADD 's3Key?: string' HERE
// Replace your additionalCerts definition with this:
additionalCerts: [
  { 
    name: '', 
    file: null as File | null, 
    currentFileName: '', 
    s3Key: undefined as string | undefined // Use undefined here
  }
],
supportDocs: [
    {
      description: '',
      file: null as File | null,
      currentFileName: '',
      s3Key: undefined as string | undefined
    }
  ],

  
  currentEvaluationName: '',
  expiryDate: ''
};

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private supplierService = inject(SupplierService);
  private snackBar = inject(MatSnackBar);

ngOnInit() {
  this.loadStatuses();

  // Read the ID from the URL parameter
  const supplierId = this.route.snapshot.paramMap.get('id');

  if (supplierId) {
    // We are in EDIT mode
    this.supplierService.getSupplierById(supplierId).subscribe({
      next: (data) => this.patchSupplierForm(data),
      error: (err) => console.error("Could not fetch supplier", err)
    });
  } else {
    // We are in ADD mode
    this.resetForm();
  }
}

  ngOnInitOld() {
    this.setDefaultExpiry();
    this.loadStatuses();
    
    this.supplierService.selectedSupplier$.subscribe(supplier => {
      if (supplier) {
        this.supplierData = supplier;
        this.patchSupplierForm(supplier);
        this.step = 2; 
      }
    });
  }

  // --- Dynamic Cert Management ---

  addTradeReference() {
  if (this.form.tradeReferences.length < 4) {
    this.form.tradeReferences.push({ 
      companyName: '', 
      email: '', 
      phone: '', 
      response: '' 
    });
  }
}

// 3. Optional: Add a remove method if they change their mind
removeTradeReference(index: number) {
  if (this.form.tradeReferences.length > 1) {
    this.form.tradeReferences.splice(index, 1);
  }
}


addCertSlot() {
  this.form.additionalCerts.push({ 
    name: '', 
    file: null, 
    currentFileName: '', 
    s3Key: undefined 
  });
}

/** * Clears ONLY the file attachment from the specific row
 */
clearCertFile(index: number) {
  const cert = this.form.additionalCerts[index];
  cert.file = null;
  cert.currentFileName = '';
  cert.s3Key = undefined; 
  
  // Reset the native file input so the user can re-upload the same file if they want
  const fileInput = document.getElementById('certFile' + index) as HTMLInputElement;
  if (fileInput) fileInput.value = '';
}

/** * Removes the entire row. If it's the last one, it clears it instead.
 */
removeCert(index: number) {
  if (this.form.additionalCerts.length > 1) {
    this.form.additionalCerts.splice(index, 1);
  } else {
    // Reset the first row instead of deleting it to keep the UI consistent
    this.clearCertFile(0);
    this.form.additionalCerts[0].name = '';
  }
}

uploadCert(event: any, index: number) {
  const file = event.target.files[0];
  if (file) {
    // Optional: Add size/type validation here
    this.form.additionalCerts[index].file = file;
    this.form.additionalCerts[index].currentFileName = file.name;
  }
}
patchSupplierForm(supplier: any) {
  if (this.form && supplier) {
    this.form.id = supplier.id;
    this.form.name = supplier.name;
    this.form.email = supplier.email || '';
    this.form.hasCert = !!supplier.hasQualityCert; 
    this.form.poNumber = supplier.poNumber || '';
    this.form.poDate = supplier.poDate || '';

    // Automatically sync rare case mode view if audit form (SAF) is bypassable
    this.isRareCase = !this.form.hasCert && !supplier.Documents?.some((d: any) => d.documentType === 'SAF');

    if (supplier.tradeReferences) {
      this.form.tradeReferences = typeof supplier.tradeReferences === 'string' 
        ? JSON.parse(supplier.tradeReferences) 
        : supplier.tradeReferences;
    }

    // --- PATCH QUALITY CERTIFICATES ---
    if (supplier.certifications && Array.isArray(supplier.certifications)) {
      this.form.additionalCerts = supplier.certifications.map((c: any) => ({
        name: c.type,
        file: null,
        currentFileName: c.fileName,
        s3Key: c.s3Key
      }));
    } else {
      this.form.additionalCerts = [{ name: '', file: null, currentFileName: '', s3Key: undefined }];
    }

    // --- PATCH SUPPORT DOCS LOGIC (FIXED) ---
    // 1. Check primary DB column name payload string allocation
    if (supplier.additionalDocuments && Array.isArray(supplier.additionalDocuments)) {
      this.form.supportDocs = supplier.additionalDocuments.map((d: any) => ({
        description: d.description || '',
        file: null,
        currentFileName: d.fileName || '', // Match key exactly
        s3Key: d.s3Key
      }));
    } 
    // 2. Relational association array string allocation fallback
    else if (supplier.supportDocuments && Array.isArray(supplier.supportDocuments)) {
      this.form.supportDocs = supplier.supportDocuments.map((d: any) => ({
        description: d.description || '',
        file: null,
        currentFileName: d.fileName || '',
        s3Key: d.s3Key
      }));
    } 
    // 3. PascalCase join query string allocation fallback
    else if (supplier.SupportDocs && Array.isArray(supplier.SupportDocs)) { 
      this.form.supportDocs = supplier.SupportDocs.map((d: any) => ({
        description: d.description || '',
        file: null,
        currentFileName: d.fileName || '',
        s3Key: d.s3Key
      }));
    } 
    // 4. Instantiate basic structure if completely new/empty array
    else {
      this.form.supportDocs = [{ description: '', file: null, currentFileName: '', s3Key: undefined }];
    }

    // --- PATCH MANDATORY SAF FORM ---
    if (supplier.Documents) {
      const evalDoc = supplier.Documents.find((d: any) => d.documentType === 'SAF');
      this.form.currentEvaluationName = evalDoc ? evalDoc.fileName : '';
    }

    if (supplier.expiryDate) {
      this.form.expiryDate = supplier.expiryDate.split('T')[0];
    }
    
    this.syncStatusLogic();
  }
}
  loadStatuses() {
    this.supplierService.getOnboardingStatuses().subscribe({
      next: (data: any[]) => {
        this.onboardingStatuses = data;
        console.log(this.onboardingStatuses ,"onboardingStatuses");
        this.syncStatusLogic(); 
      }
    });
  }

syncStatusLogic() {
  if (!this.onboardingStatuses || this.onboardingStatuses.length === 0) return;

  let targetCode = '';
  
  if (this.form.hasCert) {
    targetCode = 'LONG_TERM';
  } else if (this.isRareCase) {
    targetCode = 'CONDITIONAL';
  } else {
    targetCode = 'ONE_TIME';
  }

  const statusMatch = this.onboardingStatuses.find(s => s.code === targetCode);
  if (statusMatch) {
    this.selectedStatusId = statusMatch.id;
    console.log("Matched Status ID for DB:", this.selectedStatusId);
  } else {
    console.error("Could not find a status matching code:", targetCode);
    this.selectedStatusId = null;
  }
  
  
}

// Updated Getter for the UI Banner Label
getSelectedStatusLabel(): string {
  // Log the search parameters to the console


  // Use == instead of === to be safe against string/number mismatches from API
  const current = this.onboardingStatuses.find(s => s.id == this.selectedStatusId);
  
  if (current) {
    return current.label; // Based on your console log, the property is 'label'
  }

  return 'Select Approval Type';
}

// Updated Getter for CSS styling
getSelectedStatusCode(): string {
  const current = this.onboardingStatuses.find(s => s.id === this.selectedStatusId);
  return current ? current.code.toLowerCase() : 'default';
}

// Fix setQualityStatus to trigger logic
setQualityStatus(val: boolean) {
  this.form.hasCert = val;
  // If moving to Certified, Rare Case must be false
  if (val) this.isRareCase = false; 
  this.syncStatusLogic();
}

toggleConditional() { 
  this.syncStatusLogic(); 
}

 
  setDefaultExpiry() {
    if (!this.form.id) {
      const date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      this.form.expiryDate = date.toISOString().split('T')[0];
    }
  }



  upload(event: any, type: 'EVAL') {
    const file = event.target.files[0];
    if (file) this.form.evaluationFile = file;
  }




  next() { if (this.step < 3) this.step++; }
  prev() { if (this.step > 1) this.step--; }


// This getter fixes the 'Property isFormValid does not exist' error
get isFormValid(): boolean {
  if (!this.form.name || !this.form.email || !this.form.expiryDate) return false;

  if (this.form.hasCert) {
    // Requires at least one cert to be present to bypass SAF requirement
    return this.form.additionalCerts.some(c => c.name && (c.file || c.currentFileName)) &&
           this.form.additionalCerts.every(c => c.name && (c.file || c.currentFileName));
  }

  const hasPO = !!(this.form.poNumber && this.form.poDate);
  if (this.isRareCase) return hasPO;
  
  const hasAudit = !!(this.form.evaluationFile || this.form.currentEvaluationName);
  const hasTradeRefs = this.form.tradeReferences.slice(0, 3).every(r => r.companyName && r.email);
  return hasPO && hasAudit && hasTradeRefs;
}

submitold() {
  // 1. Final Validation Guard
  if (!this.isFormValid) {
    this.showSnackbar("Please fill all required fields and upload mandatory documents.", "error");
    return;
  }

  this.loading = true;
  const formData = new FormData();




  // 2. Map Basic Supplier Identity
  // We use a local constant for the ID to satisfy TypeScript strict null checks
  const supplierId = this.form.id; 
  if (supplierId) {
    formData.append('id', supplierId.toString());
  }

  formData.append('name', this.form.name);
  formData.append('email', this.form.email);
  formData.append('hasQualityCert', String(this.form.hasCert));
  formData.append('expiryDate', this.form.expiryDate);
  formData.append('onboardingStatusId', this.selectedStatusId ? this.selectedStatusId.toString() : '');

  // 3. Handle Existing vs New Certifications (Patching Logic)
  // Filters certs that were already on S3 and haven't been replaced by a new file
  const keptCerts = this.form.additionalCerts
    .filter(c => c.s3Key && !c.file)
    .map(c => ({ 
      type: c.name, 
      fileName: c.currentFileName, 
      s3Key: c.s3Key 
    }));
  formData.append('existingCerts', JSON.stringify(keptCerts));

  // Append newly uploaded certification files
  this.form.additionalCerts.forEach((cert, index) => {
    if (cert.file) {
      formData.append('qualityDocs', cert.file);
      formData.append('qualityDocNames', cert.name || `Cert_${index}`);
    }
  });

  // 4. Handle Non-Certified Logic (Standard vs Rare Case)
  if (!this.form.hasCert) {
    formData.append('poNumber', this.form.poNumber || '');
    formData.append('poDate', this.form.poDate || '');
    
    // Trade references are sent as a JSON string
    formData.append('tradeReferences', JSON.stringify(this.form.tradeReferences));
  }

  // 5. Audit Form (Evaluation) Logic
  if (this.form.evaluationFile) {
    formData.append('evaluationDoc', this.form.evaluationFile);
  }

  // 6. Execute Service Call
  // If supplierId exists, call update; otherwise, call register.
  const request$ = supplierId 
    ? this.supplierService.updateSupplier(supplierId, formData) 
    : this.supplierService.registerSupplier(formData);

  request$.subscribe({
    next: (res: any) => {
      this.loading = false;
      const message = supplierId ? "Supplier updated successfully!" : "Supplier registered successfully!";
      this.showSnackbar(message, "success");
      
      // Navigate back or reset
      setTimeout(() => this.resetForm(), 1500);
    },
    error: (err) => {
      this.loading = false;
      const errMsg = err.error?.message || "An error occurred while saving.";
      this.showSnackbar(errMsg, "error");
      console.error("Submission Error:", err);
    }
  });
}
submit() {
    if (!this.isFormValid) {
      this.showSnackbar("Please fill all required fields and upload mandatory documents.", "error");
      return;
    }

    this.loading = true;
    const formData = new FormData();

    const supplierId = this.form.id; 
    if (supplierId) {
      formData.append('id', supplierId.toString());
    }

    formData.append('name', this.form.name);
    formData.append('email', this.form.email);
    formData.append('hasQualityCert', String(this.form.hasCert));
    formData.append('expiryDate', this.form.expiryDate);
    formData.append('onboardingStatusId', this.selectedStatusId ? this.selectedStatusId.toString() : '');

    // Handle Certifications
    const keptCerts = this.form.additionalCerts
      .filter(c => c.s3Key && !c.file)
      .map(c => ({ 
        type: c.name, 
        fileName: c.currentFileName, 
        s3Key: c.s3Key 
      }));
    formData.append('existingCerts', JSON.stringify(keptCerts));

    this.form.additionalCerts.forEach((cert, index) => {
      if (cert.file) {
        formData.append('qualityDocs', cert.file);
        formData.append('qualityDocNames', cert.name || `Cert_${index}`);
      }
    });

    // --- NEW: Handle Support Documents Payload ---
    if (!this.form.hasCert && this.form.supportDocs) {
      // Filter out files that were already saved on S3 and haven't been replaced
      const keptSupportDocs = this.form.supportDocs
        .filter(d => d.s3Key && !d.file)
        .map(d => ({
          description: d.description,
          fileName: d.currentFileName,
          s3Key: d.s3Key
        }));
      formData.append('existingSupportDocs', JSON.stringify(keptSupportDocs));

      // Append newly uploaded support document files
      this.form.supportDocs.forEach((doc, index) => {
        if (doc.file) {
          formData.append('supportDocs', doc.file);
          formData.append('supportDocDescriptions', doc.description || `Doc_${index}`);
        }
      });
    }

    if (!this.form.hasCert) {
      formData.append('poNumber', this.form.poNumber || '');
      formData.append('poDate', this.form.poDate || '');
      formData.append('tradeReferences', JSON.stringify(this.form.tradeReferences));
    }

    if (this.form.evaluationFile) {
      formData.append('evaluationDoc', this.form.evaluationFile);
    }

    const request$ = supplierId 
      ? this.supplierService.updateSupplier(supplierId, formData) 
      : this.supplierService.registerSupplier(formData);

    request$.subscribe({
      next: (res: any) => {
        this.loading = false;
        const message = supplierId ? "Supplier updated successfully!" : "Supplier registered successfully!";
        this.showSnackbar(message, "success");
        setTimeout(() => this.resetForm(), 1500);
      },
      error: (err) => {
        this.loading = false;
        const errMsg = err.error?.message || "An error occurred while saving.";
        this.showSnackbar(errMsg, "error");
        console.error("Submission Error:", err);
      }
    });
  }

showSnackbar(message: string, type: 'success' | 'error') {
  this.snackBar.open(message, 'Close', {
    duration: 3000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
    panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
  });
}

 resetForm() {
  this.step = 1;
  this.form = {
    id: null, 
    name: '', 
    email: '', 
    hasCert: true, 
    poNumber: '', 
    poDate: '',
    tradeReferences: [
      { companyName: '', email: '', phone: '', response: '' } // Start with only one
    ],
    evaluationFile: null,
    additionalCerts: [
      { name: '', file: null, currentFileName: '', s3Key: undefined }
    ],
    // 👇 ADD THIS LINE TO FIX THE COMPILER ERROR
    supportDocs: [
      { description: '', file: null, currentFileName: '', s3Key: undefined }
    ],
    currentEvaluationName: '', 
    expiryDate: ''
  };
  this.setDefaultExpiry();
  this.syncStatusLogic();
}



  // Step 1 Validation: Basic Identity
get isStep1Valid(): boolean {
  return !!(this.form.name && this.form.email && this.form.email.includes('@'));
}

// Step 2 Validation: Compliance Logic
get isStep2Valid(): boolean {
  const hasExpiry = !!this.form.expiryDate;
  
  if (this.form.hasCert) {
    // 1. Check if at least one certification is fully filled/uploaded
    const hasAtLeastOneCert = this.form.additionalCerts.some(
      c => c.name && (c.file || c.currentFileName)
    );

    // 2. Ensure ALL added certification rows are complete
    const allAddedCertsValid = this.form.additionalCerts.every(
      c => c.name && (c.file || c.currentFileName)
    );

    // SAF is now ignored here; we only care about Expiry and the Certs
    return hasExpiry && hasAtLeastOneCert && allAddedCertsValid; 
  }

  // Non-Certified logic remains the same
  const hasPO = !!(this.form.poNumber && this.form.poDate);
  if (this.isRareCase) {
    return hasExpiry && hasPO;
  } else {
    const hasAuditFile = !!(this.form.evaluationFile || this.form.currentEvaluationName);
    const hasTradeRefs = this.form.tradeReferences.slice(0, 3).every(r => r.companyName && r.email);
    return hasExpiry && hasPO && hasAuditFile && hasTradeRefs;
  }
}
// Initialize array structure within form initialization logic
// form.supportDocs = [];

addSupportDocSlot() {
  if (!this.form.supportDocs) {
    this.form.supportDocs = [];
  }
  // Change currentFileName from null to ''
  this.form.supportDocs.push({ 
    description: '', 
    file: null, 
    currentFileName: '', 
    s3Key: undefined 
  });
}

clearSupportDocFile(index: number) {
  this.form.supportDocs[index].file = null;
  // Change from null to ''
  this.form.supportDocs[index].currentFileName = ''; 
  this.form.supportDocs[index].s3Key = undefined;
}

removeSupportDoc(index: number) {
  this.form.supportDocs.splice(index, 1);
}

uploadSupportDoc(event: any, index: number) {
  const file = event.target.files[0];
  if (file) {
    this.form.supportDocs[index].file = file;
    this.form.supportDocs[index].currentFileName = file.name;
  }
}


}