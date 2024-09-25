import { AxiosInstance } from "axios"

export interface CustomerType {
    customer: Customer
    relationShip: RelationShip
    profile: Profile
    contacts: Contact[]
    attachments: any[]
    affiliations: any[]
    determinant: Determinant
    customerClusterExperienceView: CustomerClusterExperienceView
}

export type Data = {
    id: number
    name: string
    primaryDocumentNumber: string
    primaryDocumentSituation: string
    status: string
    motherName: string
    birthDate: string
    alternateDocumentType: string
    alternateDocumentNumber: string
    alternateDocumentIssueDate: string
    email: string
    segmentId: number
    segment: {
      id: number
      name: string
      parentSegment: {
        id: number
        name: string
        flagActive: boolean
        createdBy: string
        createdAt: string
      }
      superSegment: {
        id: number
        name: string
        flagActive: boolean
        createdBy: string
        createdAt: string
      }
      flagActive: boolean
      createdBy: string
      createdAt: string
    }
    businessUnit: {
      id: number
      name: string
      displayName: string
      description: string
      flagActive: boolean
      createdAt: string
      createdBy: string
    }
    businessUnitSegment: {
      id: number
      name: string
      displayName: string
      description: string
      flagActive: boolean
      createdAt: string
      createdBy: string
    }
    operator: {
      id: number
      name: string
      flagActive: string
      createdBy: string
      createdAt: string
      updatedBy: string
      updatedAt: string
    }
    customerType: number
    flagMunicipalRegistrationExempt: boolean
    notificationMethod: string
    gender: string
    category: string
    relationshipClass: string
    flagReceiveOfferBySms: boolean
    flagReceiveOfferByEmail: boolean
    flagValidated: boolean
    lastCustomerUpdateDate: string
    createdAt: string
    createdBy: string
    updatedAt: string
    updatedBy: string
    income: number
    primaryDocumentValidUntil: string
    primaryDocumentValidAttempCount: number
    lastRelationshipClassUpdateDate: string
    mosaic: string
}  
  
export interface Customer {
    id: number
    primaryDocumentNumber: string
    name: string
    motherName: string
    alternateDocumentNumber: string
    flagMunicipalRegistrationExempt: boolean
    notificationMethod: string
    email: string
    monthlyIncome: number
    flagReceiveOfferByEmail: boolean
    flagReceiveOfferBySms: boolean
    registrationStatus: string
    status: string
    flagValidated: boolean
    alternateDocumentTypeLov: string
    createdAt: string
    updatedAt: string
    createdBy: string
    updatedBy: string
    birthDate: string
    alternateDocumentIssueDate: string
    emailTag: boolean
    mosaic: string
}
  
export interface RelationShip {
    relationshipClass: string
    notificationMethods: NotificationMethod[]
}
  
export interface NotificationMethod {
    notificationCategoryDisplayValue: string
    notificationMethodDisplayValue: string
    notificationMethodValue: string
    notificationCategoryValue: string
}
  
export interface Profile {
    categoryLov: string
    genderLov: string
    segmentId: number
    subSegmentId: number
    operatorOrigin: string
    classifications: any[]
    businessUnit: BusinessUnit
    businessUnitSegment: BusinessUnitSegment
}
  
export interface BusinessUnit {
    id: number
    name: string
    displayName: string
    description: string
    flagActive: boolean
    createdAt: string
    createdBy: string
}
  
export interface BusinessUnitSegment {
    id: number
    name: string
    displayName: string
    description: string
    flagActive: boolean
    createdAt: string
    createdBy: string
}
  
export interface Contact {
    id: number
    name: string
    dateOfBirth: string
    sex: string
    phone1: string
    email: string
    emailTag: boolean
    affiliation: string
    type: string
    status: string
    createdAt: string
    updatedAt: string
    createdBy: string
    updatedBy: string
    primaryDocumentNumber: string
}
  
export interface Determinant {}
  
export interface CustomerClusterExperienceView {}

export async function getCustomerByDocument(document: string, api: AxiosInstance)
{
    const time = new Date().getTime()
    const findCustomerResponse = await api.get<Data[]>(`/crm/customer/json/findByCpfCnpj/${document}?_=${time}`)

    const customerId = findCustomerResponse.data[0].id
    const url = document.length > 11
        ? '/crm/resources/rest/customer/physical-person/findById'
        : '/crm/resources/rest/customer/physical-person/findById'

    const customerResponse = await api.post<CustomerType>(url, customerId, {
        headers: {
            'Content-Type': 'application/json',
            'masked-fields': '[]'
        }
    })

    const out = { ...customerResponse.data, data: findCustomerResponse.data[0], }
    
    return out
}