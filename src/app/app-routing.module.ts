import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { RecipeStartComponent } from './recipes/recipe-start/recipe-start.component';
import { RecipeDetailsComponent } from './recipes/recipe-details/recipe-details.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { RecipesResolverService } from './recipes/recipes-resolver.service';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';


const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  {
    path: 'recipes',
    component: RecipesComponent, canActivate:[AuthGuard],
    children: [
      { path: '', component: RecipeStartComponent },
      {path:'new',component:RecipeEditComponent},
      {path:':id', component:RecipeDetailsComponent, resolve: [RecipesResolverService]},
      {path:':id/edit',component:RecipeEditComponent, resolve: [RecipesResolverService]},

    ],
  },
  { path: 'shopping-list', component: ShoppingListComponent },
  { path: 'auth', component: AuthComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes,{
    onSameUrlNavigation:'reload'
  })],
  exports: [RouterModule],
  providers:[AuthGuard],
})
export class AppRoutingModule {}
