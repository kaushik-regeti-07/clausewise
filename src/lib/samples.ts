export interface SampleDocument {
  id: string;
  label: string;
  fileName: string;
  pdfPath: string;
  text: string;
}

export const SAMPLE_DOCUMENTS: SampleDocument[] = [
  {
    id: "rental",
    label: "Rental agreement",
    fileName: "rental-agreement.pdf",
    pdfPath: "/samples/rental-agreement.pdf",
    text: `SUNRISE APARTMENTS
RESIDENTIAL LEASE AGREEMENT

This Lease Agreement ("Lease") is entered into between Sunrise Apartments LLC ("Landlord") and the undersigned Tenant, for the residential unit located at 42 Maple Court, Unit 3B.

1. TERM. This Lease begins on the Commencement Date and continues for an initial term of twelve (12) months. Thereafter, this Lease shall automatically renew for successive twelve (12) month terms unless Tenant provides Landlord with written notice of non-renewal at least ninety (90) days prior to the end of the then-current term. Failure to provide timely notice obligates Tenant to the full subsequent term regardless of Tenant's intent to vacate.

2. RENT AND LATE FEES. Rent is due in full on the 1st day of each month. Any payment received after the 1st shall incur a late fee equal to ten percent (10%) of the monthly rent, assessed for each day the payment remains outstanding, with no grace period.

3. SECURITY DEPOSIT. Tenant shall pay a security deposit equal to three (3) months' rent prior to occupancy. Landlord may deduct any amount from the deposit for "general wear and tear" or "cleaning and restoration" at Landlord's sole and absolute discretion, and Landlord is under no obligation to provide Tenant with an itemized list of such deductions or supporting receipts.

4. MAINTENANCE AND REPAIRS. Tenant shall be solely responsible for all maintenance and repairs to the unit during the term of this Lease, including but not limited to structural repairs, plumbing, electrical systems, and appliances, regardless of the cause of the defect or damage.

5. EARLY TERMINATION. Tenant may not terminate this Lease early for any reason, including but not limited to job relocation, medical hardship, or change in family circumstances. Should Tenant vacate the premises prior to the end of the term, Tenant shall remain liable for all remaining rent payments due under the Lease, in addition to an early termination penalty equal to two (2) months' rent.

6. RIGHT OF ENTRY. Landlord reserves the right to enter the premises at any time, for any purpose, without providing advance notice to Tenant.

7. GOVERNING LAW. This Lease shall be governed by the laws of the state in which the property is located.

IN WITNESS WHEREOF, the parties have executed this Lease as of the date first written above.`,
  },
  {
    id: "insurance",
    label: "Health insurance policy",
    fileName: "health-insurance-policy.pdf",
    pdfPath: "/samples/health-insurance-policy.pdf",
    text: `SECURELIFE HEALTH ASSURANCE
INDIVIDUAL HEALTH INSURANCE POLICY - SUMMARY OF BENEFITS

This document summarizes the terms of coverage under the SecureLife Basic Health Plan ("Policy") issued to the Policyholder named in the enrollment form.

1. WAITING PERIOD. Coverage for any pre-existing condition, as defined in Section 12, shall not commence until forty-eight (48) months after the Policy Effective Date. Claims submitted for pre-existing conditions prior to this period will be denied in full.

2. PREMIUM ADJUSTMENT. SecureLife reserves the right to increase the annual premium at any time and at its sole discretion, with such changes taking effect thirty (30) days after notice is posted to the Policyholder's online account. Continued payment of premium after such notice constitutes acceptance of the revised rate.

3. CO-PAYMENT AND DEDUCTIBLE. The Policyholder is responsible for a co-payment of twenty percent (20%) of all inpatient hospitalization charges, in addition to an annual deductible of INR 50,000, which must be satisfied before any benefit becomes payable, per Policy Year.

4. ROOM RENT CAPPING. Reimbursement for hospital room rent is capped at one percent (1%) of the Sum Insured per day. Should the Policyholder occupy a room exceeding this limit, all associated charges - including doctor's fees, nursing charges, and consumables - shall be proportionately reduced, not solely the room rent difference.

5. CLAIM DENIAL AND DISPUTE RESOLUTION. Any dispute regarding a denied or partially settled claim must be raised in writing within fifteen (15) days of the denial notice, and shall be resolved solely through binding arbitration conducted in the city where SecureLife's registered office is located. The Policyholder waives the right to pursue the claim through any civil court.

6. POLICY CANCELLATION. SecureLife may cancel this Policy at any time by providing fifteen (15) days' written notice, without obligation to refund any portion of the premium already paid for the current Policy Year.

7. RENEWAL. This Policy is renewable annually at SecureLife's sole discretion and is not guaranteed to be renewed regardless of the Policyholder's claims history.

This summary is provided for convenience; the full Policy wording governs in the event of any conflict.`,
  },
];
