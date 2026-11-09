import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SupplierService } from './services/supplier.service';

interface OnboardingStatus {
  id: number;
  code: string;
  label: string;
}

@Component({
  selector: 'app-supplier',
  imports: [FormsModule, DatePipe],
  templateUrl: './supplier.html',
  styleUrl: './supplier.scss',
})
export class Supplier implements OnInit {
  step: number = 1;
  loading: boolean = false;
  isRareCase: boolean = false;
  removeEvaluationDoc: boolean = false;

  onboardingStatuses: OnboardingStatus[] = [];
  selectedStatusId: number | null = null;
  readonly CERT_OPTIONS = [
    'FAA AC 00-56 B ACCREDITED',
    'AFRA ACCREDITED',
    'AIRLINE',
    'REPAIR STATION/AMO',
    'OEM OR THEIR AUTHORIZED DISTRIBUTOR',
    'ISO/AS/EN',
  ];

  form = {
    id: null as number | null,
    name: '',
    email: '',
    hasCert: true,
    poNumber: '',
    poDate: '',
    tradeReferences: [
      { companyName: '', email: '', phone: '', response: '' }
    ],
    evaluationFile: null as File | null,
    additionalCerts: [
      {
        name: '',
        file: null as File | null,
        currentFileName: '',
        s3Key: undefined as string | undefined
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

  private readonly route = inject(ActivatedRoute);
  private readonly supplierService = inject(SupplierService);
  private readonly snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.loadStatuses();

    const supplierId = this.route.snapshot.paramMap.get('id');

    if (supplierId) {
      this.supplierService.getSupplierById(supplierId).subscribe({
        next: (data) => this.patchSupplierForm(data),
        error: (err) => console.error('Could not fetch supplier', err)
      });
    } else {
      this.resetForm();
    }
  }

  private getFile(event: Event): File | null {
    return (event.target as HTMLInputElement).files?.[0] ?? null;
  }

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

  clearCertFile(index: number) {
    const cert = this.form.additionalCerts[index];
    cert.file = null;
    cert.currentFileName = '';
    cert.s3Key = undefined;

    const fileInput = document.getElementById('certFile' + index) as HTMLInputElement | null;
    if (fileInput) fileInput.value = '';
  }

  removeCert(index: number) {
    if (this.form.additionalCerts.length > 1) {
      this.form.additionalCerts.splice(index, 1);
    } else {
      this.clearCertFile(0);
      this.form.additionalCerts[0].name = '';
    }
  }

  uploadCert(event: Event, index: number) {
    const file = this.getFile(event);
    if (file) {
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

      this.isRareCase = !this.form.hasCert && !supplier.Documents?.some((d: any) => d.documentType === 'SAF');

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
          s3Key: c.s3Key
        }));
      } else {
        this.form.additionalCerts = [{ name: '', file: null, currentFileName: '', s3Key: undefined }];
      }

      if (supplier.additionalDocuments && Array.isArray(supplier.additionalDocuments)) {
        this.form.supportDocs = supplier.additionalDocuments.map((d: any) => ({
          description: d.description || '',
          file: null,
          currentFileName: d.fileName || '',
          s3Key: d.s3Key
        }));
      } else if (supplier.supportDocuments && Array.isArray(supplier.supportDocuments)) {
        this.form.supportDocs = supplier.supportDocuments.map((d: any) => ({
          description: d.description || '',
          file: null,
          currentFileName: d.fileName || '',
          s3Key: d.s3Key
        }));
      } else if (supplier.SupportDocs && Array.isArray(supplier.SupportDocs)) {
        this.form.supportDocs = supplier.SupportDocs.map((d: any) => ({
          description: d.description || '',
          file: null,
          currentFileName: d.fileName || '',
          s3Key: d.s3Key
        }));
      } else {
        this.form.supportDocs = [{ description: '', file: null, currentFileName: '', s3Key: undefined }];
      }

      if (supplier.Documents) {
        const evalDoc = supplier.Documents.find((d: any) => d.documentType === 'SAF');
        this.form.currentEvaluationName = evalDoc ? evalDoc.fileName : '';
      }

      if (supplier.expiryDate && !isNaN(Date.parse(supplier.expiryDate))) {
        this.form.expiryDate = supplier.expiryDate.split('T')[0];
      } else {
        this.form.expiryDate = '';
      }

      if (supplier.poDate && !isNaN(Date.parse(supplier.poDate))) {
        this.form.poDate = supplier.poDate.split('T')[0];
      } else {
        this.form.poDate = '';
      }

      this.syncStatusLogic();
    }
  }

  loadStatuses() {
    this.supplierService.getOnboardingStatuses().subscribe({
      next: (data: OnboardingStatus[]) => {
        this.onboardingStatuses = data;
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
    } else {
      console.error('Could not find a status matching code:', targetCode);
      this.selectedStatusId = null;
    }
  }

  getSelectedStatusLabel(): string {
    const current = this.onboardingStatuses.find(s => s.id == this.selectedStatusId);
    return current ? current.label : 'Select Approval Type';
  }

  getSelectedStatusCode(): string {
    const current = this.onboardingStatuses.find(s => s.id == this.selectedStatusId);
    return current ? current.code.toLowerCase() : 'default';
  }

  setQualityStatus(val: boolean) {
    this.form.hasCert = val;
    if (val) this.isRareCase = false;
    this.syncStatusLogic();
  }

  setDefaultExpiry() {
    if (!this.form.id) {
      const date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      this.form.expiryDate = date.toISOString().split('T')[0];
    }
  }

  upload(event: Event, type: 'EVAL') {
    const file = this.getFile(event);
    if (file) {
      this.form.evaluationFile = file;
      this.removeEvaluationDoc = false;
    }
  }

  clearEvaluation(input?: HTMLInputElement) {
    if (this.form.currentEvaluationName) this.removeEvaluationDoc = true;
    this.form.evaluationFile = null;
    this.form.currentEvaluationName = '';
    if (input) input.value = '';
  }

  next() { if (this.step < 3) this.step++; }
  prev() { if (this.step > 1) this.step--; }

  submit() {
    if (!(this.isStep1Valid && this.isStep2Valid)) {
      this.showSnackbar('Please fill all required fields and upload mandatory documents.', 'error');
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

    if (!this.form.hasCert && this.form.supportDocs) {
      const keptSupportDocs = this.form.supportDocs
        .filter(d => d.s3Key && !d.file)
        .map(d => ({
          description: d.description,
          fileName: d.currentFileName,
          s3Key: d.s3Key
        }));
      formData.append('existingSupportDocs', JSON.stringify(keptSupportDocs));

      this.form.supportDocs.forEach((doc, index) => {
        if (doc.file) {
          formData.append('supportDocs', doc.file);
          formData.append('supportDocDescriptions', doc.description || `Doc_${index}`);
        }
      });
    }

    if (!this.form.hasCert) {
      formData.append('poNumber', this.form.poNumber || '');
      const formattedPoDate = (this.form.poDate && !isNaN(Date.parse(this.form.poDate)))
        ? this.form.poDate
        : '';

      formData.append('poDate', formattedPoDate);
      formData.append('tradeReferences', JSON.stringify(this.form.tradeReferences));
    }

    if (this.form.evaluationFile) {
      formData.append('evaluationDoc', this.form.evaluationFile);
    }

    const request$ = supplierId
      ? this.supplierService.updateSupplier(supplierId, formData)
      : this.supplierService.registerSupplier(formData);

    request$.subscribe({
      next: () => {
        this.loading = false;
        const message = supplierId ? 'Supplier updated successfully!' : 'Supplier registered successfully!';
        this.showSnackbar(message, 'success');
        setTimeout(() => this.resetForm(), 1500);
      },
      error: (err) => {
        this.loading = false;
        const errMsg = err.error?.message || 'An error occurred while saving.';
        this.showSnackbar(errMsg, 'error');
        console.error('Submission Error:', err);
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
        { companyName: '', email: '', phone: '', response: '' }
      ],
      evaluationFile: null,
      additionalCerts: [
        { name: '', file: null, currentFileName: '', s3Key: undefined }
      ],
      supportDocs: [
        { description: '', file: null, currentFileName: '', s3Key: undefined }
      ],
      currentEvaluationName: '',
      expiryDate: ''
    };
    this.setDefaultExpiry();
    this.syncStatusLogic();
  }

  get isStep1Valid(): boolean {
    return !!(this.form.name && this.form.email && this.form.email.includes('@'));
  }

  get isStep2Valid(): boolean {
    const hasExpiry = !!this.form.expiryDate;

    if (this.form.hasCert) {
      const hasAtLeastOneCert = this.form.additionalCerts.some(
        c => c.name && (c.file || c.currentFileName)
      );

      const allAddedCertsValid = this.form.additionalCerts.every(
        c => c.name && (c.file || c.currentFileName)
      );

      return hasExpiry && hasAtLeastOneCert && allAddedCertsValid;
    }

    if (this.isRareCase) {
      return hasExpiry;
    }

    const hasAuditFile = !!(this.form.evaluationFile || this.form.currentEvaluationName);
    const hasTradeRefs = this.form.tradeReferences.slice(0, 3).every(r => r.companyName && r.email);
    return hasExpiry && hasAuditFile && hasTradeRefs;
  }

  addSupportDocSlot() {
    if (!this.form.supportDocs) {
      this.form.supportDocs = [];
    }
    this.form.supportDocs.push({
      description: '',
      file: null,
      currentFileName: '',
      s3Key: undefined
    });
  }

  clearSupportDocFile(index: number) {
    this.form.supportDocs[index].file = null;
    this.form.supportDocs[index].currentFileName = '';
    this.form.supportDocs[index].s3Key = undefined;
  }

  removeSupportDoc(index: number) {
    this.form.supportDocs.splice(index, 1);
  }

  uploadSupportDoc(event: Event, index: number) {
    const file = this.getFile(event);
    if (file) {
      this.form.supportDocs[index].file = file;
      this.form.supportDocs[index].currentFileName = file.name;
    }
  }
}