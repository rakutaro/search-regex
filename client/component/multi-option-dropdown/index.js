/**
 * External dependencies
 */

import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */

import Dropdown from 'component/dropdown';
import Badge from 'component/badge';
import MultiOptionGroup from './group';
import './style.scss';

const MAX_BADGES = 3;

class MultiOptionDropdown extends React.Component {
	static propTypes = {
		title: PropTypes.string.isRequired,
		selected: PropTypes.object.isRequired,
		isEnabled: PropTypes.bool,
		onApply: PropTypes.func.isRequired,
		options: PropTypes.array.isRequired,
		badges: PropTypes.bool,
		className: PropTypes.string,
		hideTitle: PropTypes.bool,
		badgeValues: PropTypes.bool,
		customBadge: PropTypes.func,
	};

	static defaultProps = {
		badges: false,
		title: false,
		hideTitle: false,
		isEnabled: true,
		badgeValues: false,
	};

	removeFilter = ( name, ev ) => {
		ev.preventDefault();
		ev.stopPropagation();

		let newSelected;
		if ( this.props.badgeValues ) {
			newSelected = this.getBadgeValues().filter( item => item !== name );
		} else {
			newSelected = { ... this.props.selected };

			delete newSelected[ name ];
		}

		this.props.onApply( newSelected, name );
	}

	getOptionForKey( options, key ) {
		const { badgeValues } = this.props;

		if ( badgeValues ) {
			let values = [];

			Object.keys( options ).map( item => values = values.concat( options[ item ].options ) );

			return values.find( item => item.value === key );
		}

		return options.find( item => item.value === key );
	}

	getBadgeValues() {
		const { selected, badgeValues } = this.props;

		if ( badgeValues ) {
			let values = [];

			Object.keys( selected ).map( item => values = values.concat( selected[ item ] ) );

			return values;
		}

		return Object.keys( selected ).filter( item => selected[ item ] !== undefined );
	}

	getBadges() {
		const { selected, options, badges, badgeValues, customBadge } = this.props;
		const keys = customBadge ? customBadge( this.getBadgeValues() ) : this.getBadgeValues();

		if ( keys.length > 0 && badges ) {
			return keys.slice( 0, MAX_BADGES ).map( key => {
				const found = this.getOptionForKey( options, key );

				return found && ( selected[ key ] || badgeValues ) ? <Badge key={ key } onCancel={ ev => this.removeFilter( key, ev ) }>{ found.label }</Badge> : null;
			} ).concat(
				[ keys.length > MAX_BADGES ? <span key="end">...</span> : null ],
			);
		}

		return null;
	}

	shouldShowTitle() {
		const { selected, hideTitle } = this.props;

		if ( hideTitle === false ) {
			return true;
		}

		return Object.keys( selected ).filter( key => selected[ key ] ).length === 0;
	}

	render() {
		const { options, selected, onApply, title, isEnabled, multiple, className } = this.props;
		const badges = this.getBadges();

		return (
			<Dropdown
				renderToggle={ ( isOpen, toggle ) => (
					<button
						className={ classnames( 'button', 'action', 'redirect-multioption__button', isEnabled ? null : 'redirect-multioption__disabled', isOpen ? 'redirect-multioption__button_enabled' : null ) }
						onClick={ toggle }
						disabled={ ! isEnabled }
						type="button"
					>
						{ this.shouldShowTitle() && title.length > 0 && <h5>{ title }</h5> }
						{ badges }

						<svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path></svg>
					</button>
				) }
				matchToggle={ badges && Object.keys( selected ) }
				align="right"
				renderContent={ () => (
					<div className={ classnames( 'redirect-multioption', className ) }>
						{ options.map( group => (
							<MultiOptionGroup
								label={ group.label }
								value={ group.value }
								options={ group.options }
								multiple={ group.multiple || multiple || false }
								selected={ selected }
								key={ group.label }
								onApply={ onApply }
							/>
						) ) }
					</div>
				) }
			/>
		);
	}
}

export default MultiOptionDropdown;