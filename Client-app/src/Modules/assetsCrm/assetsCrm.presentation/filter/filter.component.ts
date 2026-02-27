import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Button } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { Company } from '../../assetsCrm.Domain/company';
import { Project } from '../../assetsCrm.Domain/project';
import {
  CompaniesGetLookUpProviders,
  CompaniesGetLookUpUseCase,
} from '../../assetsCrm.Application/usecases/company/companiesGetLookUp.usecase';
import { single } from 'rxjs';
import {
  ProjectsGetLookUpProviders,
  ProjectsGetLookUpUseCase,
} from '../../assetsCrm.Application/usecases/projects/projectsGetLookUp.usecase';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  standalone: true,
  imports: [MultiSelectModule, Button, FormsModule, TranslateModule],
  providers: [CompaniesGetLookUpProviders, ProjectsGetLookUpProviders],
})
export class FilterComponent implements OnInit {
  @Output() onFilter = new EventEmitter<any>();

  public companies: Company[] = [];
  public AllProjects: Project[] = [];
  public previewedProjects: Project[] = [];

  public selectedCompanies: string[] = [];
  public selectedProjects: string[] = [];

  private companiesIdsList: any[] = [];

  private readonly companiesGetLookUpUseCase = inject(
    CompaniesGetLookUpUseCase
  );
  private readonly projectsGetLookUpUseCase = inject(ProjectsGetLookUpUseCase);

  constructor() {}

  ngOnInit() {
    this.companiesGetLookUpUseCase.execute().subscribe((response) => {
      this.companies = response;
      // this.selectedCompanies = this.companies.map((c: Company) => c.id!);
    });
    this.getAllProjects();
  }

  getAllProjects() {
    this.projectsGetLookUpUseCase.execute().subscribe((response) => {
      this.AllProjects = response;
      this.previewedProjects = this.AllProjects;
      // this.selectedProjects = this.AllProjects.map((p: Project) => p.id!);
    });
  }

  onFilterCompanies(companiesList: any) {
    const selectedIds = this.companies.filter((c: Company) =>
      this.selectedCompanies.includes(c.id!)
    );

    this.companiesIdsList = selectedIds.map((item) => item.id);

    this.previewedProjects = this.AllProjects.filter((p: Project) =>
      this.companiesIdsList.includes(p.company?.id)
    );

    const projectsIds: any = this.previewedProjects.map((item) => item.id);
    const companiesIds: any = this.companiesIdsList;
    const Ids = { companiesIds, projectsIds };

    this.onFilter.emit(Ids);

    companiesList.hide();
  }

  onClearCompanies(companiesList: any) {
    this.selectedCompanies = [];
    this.previewedProjects = this.AllProjects;

    companiesList.hide();
  }

  onFilterProjects(projectsList: any) {
    const projectsIds = this.selectedProjects;
    const companiesIds: any = this.companiesIdsList;

    const Ids = { companiesIds, projectsIds };

    this.onFilter.emit(Ids);

    projectsList.hide();
  }
}
