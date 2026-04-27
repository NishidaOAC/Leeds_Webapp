import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SupplierService } from './services/supplier.service';
import { SupplierList } from './supplier-list/supplier-list';

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
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
  'FAA AC 00-56', 'EASA Part 145', 'AFRA ACCREDITED', 'ISO 9001', 
  'AS9100/EN9100', 'OEM AUTHORIZED', 'REPAIR STATION', 
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
    { companyName: '', email: '', phone: '', response: '' },
    { companyName: '', email: '', phone: '', response: '' },
    { companyName: '', email: '', phone: '', response: '' },
    { companyName: '', email: '', phone: '', response: '' }
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
  
  currentEvaluationName: '',
  expiryDate: ''
};

  constructor(private http: HttpClient, private supplierService: SupplierService) { }

  ngOnInit() {
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

      if (supplier.tradeReferences) {
        this.form.tradeReferences = typeof supplier.tradeReferences === 'string' 
          ? JSON.parse(supplier.tradeReferences) 
          : supplier.tradeReferences;
      }

      if (supplier.certifications && Array.isArray(supplier.certifications)) {
        this.form.additionalCerts = supplier.certifications.map((c: any) => ({
          name: c.type,
          file: null,
          currentFileName: c.fileName,
          s3Key: c.s3Key // Correctly mapped
        }));
      } else {
        // FIX: Added s3Key: undefined here
        this.form.additionalCerts = [{ name: '', file: null, currentFileName: '', s3Key: undefined }];
      }

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
// ... inside class Supplier ...

syncStatusLogic() {
  /**
   * Scenarios:
   * 1. hasCert = true                 -> Usually 'LONG_TERM'
   * 2. hasCert = false & isRareCase   -> Usually 'CONDITIONAL'
   * 3. hasCert = false & !isRareCase  -> Usually 'ONE_TIME'
   */
  
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
  // Global mandatory fields
  if (!this.form.name || !this.form.email || !this.form.expiryDate) return false;

  // Case A: Certified Supplier (LONG_TERM)
  if (this.form.hasCert) {
    const hasAudit = !!(this.form.evaluationFile || this.form.currentEvaluationName);
    const certsComplete = this.form.additionalCerts.every(c => c.name && (c.file || c.currentFileName));
    return hasAudit && certsComplete;
  }

  // Case B: Non-Certified (Standard or Rare Case)
  const hasPO = !!(this.form.poNumber && this.form.poDate);
  
  if (this.isRareCase) {
    // CONDITIONAL: Only requires PO and Expiry (Audit/Trade Refs are optional)
    return hasPO;
  } else {
    // ONE_TIME: Requires PO + Audit Form + First 3 Trade References
    const hasAudit = !!(this.form.evaluationFile || this.form.currentEvaluationName);
    const hasTradeRefs = this.form.tradeReferences.slice(0, 3).every(r => r.companyName && r.email);
    return hasPO && hasAudit && hasTradeRefs;
  }
}

submit() {
  // 1. Final Validation Guard
  if (!this.isFormValid) {
    this.showSnackbar("Please fill all required fields and upload mandatory documents.", "error");
    return;
  }

  this.loading = true;
  const formData = new FormData();



  // --- START DEBUG CONSOLE ---
  console.log("🚀 SUBMITTING DATA...");
  console.log("Current Approval Label:", this.getSelectedStatusLabel());
  console.log("Selected Status ID:", this.selectedStatusId);
  // --- END DEBUG CONSOLE ---

  

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

showSnackbar(msg: string, type: string) {
  // Replace with real Snackbar/Toast logic if available
  alert(`${type.toUpperCase()}: ${msg}`);
}

 resetForm() {
    this.step = 1;
    this.form = {
      id: null, name: '', email: '', hasCert: true, poNumber: '', poDate: '',
      tradeReferences: [
        { companyName: '', email: '', phone: '', response: '' },
        { companyName: '', email: '', phone: '', response: '' }, 
        { companyName: '', email: '', phone: '', response: '' }, 
        { companyName: '', email: '', phone: '', response: '' }
      ],
      evaluationFile: null,
      // FIX: Added s3Key: undefined here
      additionalCerts: [{ name: '', file: null, currentFileName: '', s3Key: undefined }],
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
  
  // Case 1: Certified Supplier (LONG_TERM)
  if (this.form.hasCert) {
    const hasAuditFile = !!(this.form.evaluationFile || this.form.currentEvaluationName);
    const hasValidAdditionalCerts = this.form.additionalCerts.every(c => c.name && (c.file || c.currentFileName));
    return hasExpiry && hasAuditFile && hasValidAdditionalCerts;
  }

  // Case 2: Non-Certified (ONE_TIME or CONDITIONAL)
  const hasPO = !!(this.form.poNumber && this.form.poDate);
  
  if (this.isRareCase) {
    // CONDITIONAL: Audit may/may not be there, but Trade Refs usually are
    // We only require PO and Expiry for this rare path
    return hasExpiry && hasPO;
  } else {
    // ONE_TIME: Audit + Trade References are mandatory
    const hasAuditFile = !!(this.form.evaluationFile || this.form.currentEvaluationName);
    const hasTradeRefs = this.form.tradeReferences.slice(0, 3).every(r => r.companyName && r.email);
    return hasExpiry && hasPO && hasAuditFile && hasTradeRefs;
  }
}
}