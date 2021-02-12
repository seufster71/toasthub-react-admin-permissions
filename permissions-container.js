/*
 * Copyright (C) 2016 The ToastHub Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use-strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as permissionsActions from './permissions-actions';
import fuLogger from '../../core/common/fu-logger';
import utils from '../../core/common/utils';
import PermissionsView from '../../adminView/permissions/permissions-view';
import PermissionsModifyView from '../../adminView/permissions/permissions-modify-view';
import RolePermissionsModifyView from '../../adminView/permissions/role-permissions-modify-view';
import BaseContainer from '../../core/container/base-container';

/*
* Permission Page
*/
class PermissionsContainer extends BaseContainer {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		if (this.props.history.location.state != null && this.props.history.location.state.parent != null) {
			this.props.actions.init(this.props.history.location.state.parent);
		} else {
			this.props.actions.init();
		}
	}
	
	getState = () => {
		return this.props.permissions;
	}
	
	getForm = () => {
		return "ADMIN_PERMISSION_FORM";
	}	
	
	onRolePermissionModify = (item) => {
		fuLogger.log({level:'TRACE',loc:'PermissionContainer::onRolePermissionModify',msg:"test"+item.id});
		if (item.rolePermission != null) {
			this.props.actions.modifyRolePermission({rolePermissionId:item.rolePermission.id,permissionId:item.id});
		} else {
			this.props.actions.modifyRolePermission({permissionId:item.id,appPrefs:this.props.appPrefs});
		}
	}
	
	onRolePermissionSave = () => {
		fuLogger.log({level:'TRACE',loc:'PermissionContainer::onRolePermissionSave',msg:"test"});
		let errors = utils.validateFormFields(this.props.permissions.prefForms.ADMIN_ROLE_PERMISSION_FORM,this.props.permissions.inputFields, this.props.appPrefs.prefGlobal.LANGUAGES);
		
		if (errors.isValid){
			this.props.actions.saveRolePermission({state:this.props.permissions});
		} else {
			this.setState({errors:errors.errorMap});
		}
	}
	
	onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'PermissionContainer::onOption',msg:" code "+code});
		if (this.onOptionBase(code,item)) {
			return;
		}
		
		switch(code) {
			case 'MODIFY_ROLE_PERMISSION': {
				this.onRolePermissionModify(item);
				break;
			}
		}
	}

	render() {
		fuLogger.log({level:'TRACE',loc:'PermissionsContainer::render',msg:"Hi there"});
		if (this.props.permissions.isModifyOpen) {
			return (
				<PermissionsModifyView
				itemState={this.props.permissions}
				appPrefs={this.props.appPrefs}
				onSave={this.onSave}
				onCancel={this.onCancel}
				inputChange={this.inputChange}
				applicationSelectList={this.props.permissions.applicationSelectList}/>
			);
		} else if (this.props.permissions.isRolePermissionOpen) {
			return (
				<RolePermissionsModifyView
				itemState={this.props.permissions}
				appPrefs={this.props.appPrefs}
				onSave={this.onRolePermissionSave}
				onCancel={this.onCancel}
				inputChange={this.inputChange}/>
			);
		} else if (this.props.permissions.items != null) {
			return (
				<PermissionsView 
				itemState={this.props.permissions}
				appPrefs={this.props.appPrefs}
				onListLimitChange={this.onListLimitChange}
				onSearchChange={this.onSearchChange}
				onSearchClick={this.onSearchClick}
				onPaginationClick={this.onPaginationClick}
				onOrderBy={this.onOrderBy}
				closeModal={this.closeModal}
				onOption={this.onOption}
				inputChange={this.inputChange}
				goBack={this.goBack}
				session={this.props.session}
				/>
					
			);
		} else {
			return (<div> Loading... </div>);
		}
	}
}

PermissionsContainer.propTypes = {
	appPrefs: PropTypes.object,
	actions: PropTypes.object,
	permissions: PropTypes.object,
	session: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {appPrefs:state.appPrefs, permissions:state.permissions, session:state.session};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(permissionsActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(PermissionsContainer);
