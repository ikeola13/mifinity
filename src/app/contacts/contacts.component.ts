import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  contactList = [];
  public addForm: FormGroup;
  public addressForm: FormGroup;
  submitted = false;
  submittedAddress = false;
  modalLastName;
  modalFirstName;
  modalAvatar = 'assets/images/person-circle.svg';
  contactId;
  contactAddresses = [];
  addressCount = 0;
  allCountries = [];

  constructor(public dataService: DataService, public formBuilder: FormBuilder, private toastr: ToastrService) {
    this.addForm = this.formBuilder.group({
      last_name: ['', Validators.required],
      first_name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getContacts();
    this.getCountries();
    this.newAddressForm();
  }

  newAddressForm(): void {
    this.addressForm = this.formBuilder.group({
      parameter_points: this.formBuilder.array([
        this.formBuilder.group({
          street1: ['', Validators.required],
          street2: ['', Validators.required],
          town: ['', Validators.required],
          country: ['', Validators.required],
        },
        )]),
    });
  }

  // tslint:disable-next-line:typedef
  get parameterPoints() {
    return this.addressForm.get('parameter_points') as FormArray;
  }

  addContact(form): void {
    this.submitted = true;
    if (form.valid) {
      this.dataService.addContact(form.value).subscribe((res: any) => {
        this.getContacts();
        this.addForm.reset();
        this.submitted = false;
        this.showSuccess('Contact Added!');
      });
    }
  }


  getContacts(): void {
    this.dataService.getContacts().subscribe((res: any) => {
      this.contactList = res;
    });

  }

  getCountries(): void {
    this.dataService.getCountries().subscribe((res: any) => {
      this.allCountries = res;
    });

  }

  getContact(id): void {
    this.dataService.getContact(id).subscribe((res: any) => {
      this.modalFirstName = res.first_name;
      this.modalLastName = res.last_name;
      this.contactId = res.id;
      if (res.avatar) {
        this.modalAvatar = res.avatar;
      }
    });
  }

  getAddress(id): any {
    this.getContact(id);

    this.dataService.getAddress(id).subscribe((res: any) => {
      this.addressCount = res.length;
      this.contactAddresses = res;

      this.parameterPoints.clear();

      if (res.length === 0) {
        this.addNewAddress();
      }

      for (const param of this.contactAddresses) {
        this.parameterPoints.push(this.formBuilder.group(param));
      }
    });
  }

  saveAddress(): void {
    this.submittedAddress = true;
    if (this.addressForm.valid) {
      for (const param of this.addressForm.value.parameter_points) {
        if (param.id) {
          this.dataService.deleteAddress(param.id).subscribe((res: any) => {
          });
        }
        this.dataService.saveAddress(this.contactId, param).subscribe((res: any) => {
          this.showSuccess('Addresses Updated!');
          this.submittedAddress = false;
        });
      }
    }
  }

  addNewAddress(): void {
    this.parameterPoints.push(this.formBuilder.group({
      street1: ['', Validators.required],
      street2: ['', Validators.required],
      town: ['', Validators.required],
      country: ['', Validators.required],
    }));
  }

  removeAddress(id, index): void {
    this.parameterPoints.removeAt(index);
    if (id) {
      this.dataService.deleteAddress(id).subscribe((res: any) => {
        this.getAddress(this.contactId);
        this.showSuccess('Address Removed!');
      });
    }
  }

  showSuccess(message): void {
    this.toastr.success(message, 'Success');
  }
}
